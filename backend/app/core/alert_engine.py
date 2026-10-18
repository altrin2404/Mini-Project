from datetime import datetime
import uuid
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.digital_twin import DigitalTwin
from app.models.risk_score import RiskScore



def trigger_risk_alert(db: Session, twin: DigitalTwin, previous_state: str = None):
    """
    A1–A6: Rule + analytics driven alert engine
    """

    risk = (
        db.query(RiskScore)
        .filter(RiskScore.child_id == twin.child_id)
        .first()
    )

    # ─────────────────────────────
    # A2 — Correct Severity assignment
    # total_risk score >= 75 is healthy (Low Risk / Stable)
    # total_risk score 50–74 is warning (Moderate Risk / Warning)
    # total_risk score < 50 is critical (High Risk / Critical)
    # ─────────────────────────────
    state = twin.twin_state or "stable"
    level = (twin.risk_level or "low").lower()

    if state == "critical" or level == "high" or (risk and float(risk.total_risk) < 50):
        severity = "high"
    elif state == "warning" or level == "moderate" or (risk and float(risk.total_risk) < 75):
        severity = "medium"
    else:
        severity = "low"

    # ─────────────────────────────
    # A5 — Auto-resolve when low risk / stable
    # ─────────────────────────────
    if severity == "low":
        db.query(Alert).filter(
            Alert.child_id == twin.child_id,
            Alert.resolved == False
        ).update(
            {
                "resolved": True,
                "resolved_at": datetime.utcnow()
            }
        )
        db.commit()
        return

    # ─────────────────────────────
    # A6 — Category inference
    # ─────────────────────────────
    category = "academic"
    if risk:
        att_risk = float(risk.attendance_risk or 0)
        acad_risk = float(risk.academic_risk or 0)
        beh_risk = float(risk.behavior_risk or 0)
        if att_risk > acad_risk:
            category = "attendance"
        if beh_risk > 20:
            category = "behavior"
    else:
        att_score = float(twin.attendance_score or 100)
        acad_score = float(twin.academic_score or 100)
        beh_score = float(twin.behavior_score or 100)
        if att_score < acad_score:
            category = "attendance"
        if beh_score < 70:
            category = "behavior"

    # ─────────────────────────────
    # A4 — Avoid duplicates
    # ─────────────────────────────
    exists = (
        db.query(Alert)
        .filter(
            Alert.child_id == twin.child_id,
            Alert.alert_type == f"{category}_risk",
            Alert.resolved == False
        )
        .first()
    )

    if exists:
        return

    # ─────────────────────────────
    # A1 + A3 — Create alert
    # ─────────────────────────────
    total_val = float(risk.total_risk) if risk else float(twin.academic_score or 0) * 0.5 + float(twin.attendance_score or 0) * 0.3 + float(twin.behavior_score or 0) * 0.2
    alert = Alert(
        id=str(uuid.uuid4()),
        child_id=twin.child_id,
        alert_type=f"{category}_risk",
        severity=severity,
        message=f"{category.capitalize()} risk is {severity.upper()} (Twin State: {state.capitalize()})",
        context={
            "total_risk": total_val,
            "attendance_risk": float(risk.attendance_risk) if risk else 100.0 - float(twin.attendance_score or 0),
            "academic_risk": float(risk.academic_risk) if risk else 100.0 - float(twin.academic_score or 0),
            "behavior_risk": float(risk.behavior_risk) if risk else 100.0 - float(twin.behavior_score or 0),
            "twin_state": state
        },
        resolved=False
    )

    db.add(alert)
    db.commit()

