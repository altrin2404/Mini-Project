from sqlalchemy.orm import Session
from datetime import datetime

from app.models.event import Event
from app.models.digital_twin import DigitalTwin
from app.models.twin_snapshot import TwinSnapshot
from app.models.risk_score import RiskScore

from app.core.event_normalizer import normalize_event
from app.core.feature_engine import update_student_features
from app.core.twin_metrics import compute_twin_metrics
from app.core.twin_engine import create_twin_if_not_exists
from app.core.risk_engine import compute_risk
from app.core.alert_engine import trigger_risk_alert


def process_events(db: Session, limit: int = 50):
    events = (
        db.query(Event)
        .filter(Event.processed == False)
        .order_by(Event.timestamp)
        .limit(limit)
        .all()
    )

    for event in events:
        try:
            process_single_event(db, event)
        except Exception as e:
            event.processed = True
            event.payload = {
                **(event.payload or {}),
                "error": str(e),
                "note": "Auto-skipped due to processing error"
            }

    db.commit()


def process_single_event(db: Session, event: Event):
    # SYSTEM / ADMIN EVENTS
    if not event.child_id:
        event.processed = True
        return

    # 1️⃣ Normalize event
    normalized = normalize_event(event)

    # 2️⃣ Update features (student_features table)
    features = update_student_features(
        db=db,
        child_id=event.child_id,
        event=normalized
    )

    # 3️⃣ Fetch or create twin
    twin = create_twin_if_not_exists(db, event.child_id)

    # 4️⃣ Compute twin metrics (aggregation)
    metrics = compute_twin_metrics(db, event.child_id)

    twin.academic_score = metrics.academic
    twin.attendance_score = metrics.attendance
    twin.behavior_score = metrics.behavior

    # 5️⃣ Risk engine
    risk = compute_risk(metrics)

    previous_state = twin.twin_state
    previous_risk = twin.risk_level

    twin.risk_level = risk.level
    twin.explanation = risk.explanation

    if risk.score >= 75:
        twin.twin_state = "stable"
    elif risk.score >= 50:
        twin.twin_state = "warning"
    else:
        twin.twin_state = "critical"

    # Forecasting metrics
    twin.predicted_gpa = round(min(10.0, (metrics.academic * 0.7 + metrics.attendance * 0.3) / 10.0), 1)
    twin.failure_probability = 0.8 if metrics.academic < 50 else (0.4 if metrics.attendance < 75 else 0.05)
    twin.confidence = 0.95
    twin.last_updated = datetime.utcnow()
    twin.last_updated_at = datetime.utcnow()

    # Update or insert RiskScore table
    risk_record = db.query(RiskScore).filter(RiskScore.child_id == event.child_id).first()
    if not risk_record:
        risk_record = RiskScore(child_id=event.child_id)
        db.add(risk_record)
    risk_record.academic_risk = round(max(0.0, 100.0 - metrics.academic), 2)
    risk_record.attendance_risk = round(max(0.0, 100.0 - metrics.attendance), 2)
    risk_record.behavior_risk = round(max(0.0, 100.0 - metrics.behavior), 2)
    risk_record.volatility_risk = round(getattr(features, "volatility_score", 0.0) or 0.0, 2)
    risk_record.total_risk = round(risk.score, 2)

    # 6️⃣ Snapshot on state change
    if previous_state != twin.twin_state or previous_risk != twin.risk_level:
        snapshot = TwinSnapshot(
            child_id=event.child_id,
            snapshot_time=datetime.utcnow(),
            twin_state=twin.twin_state,
            derived_metrics=metrics.dict()
        )
        db.add(snapshot)

        # 7️⃣ Alert trigger (state-aware)
        trigger_risk_alert(db, twin, previous_state)
    elif twin.twin_state in ("critical", "warning"):
        trigger_risk_alert(db, twin, previous_state)

    # 8️⃣ Mark processed
    event.processed = True

