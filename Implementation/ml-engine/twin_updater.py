from datetime import datetime
from sqlalchemy.orm import Session
from models import DigitalTwin


def update_twin(
    db: Session,
    child_id: str,
    scores: dict,
    forecast: dict = None
):
    twin = (
        db.query(DigitalTwin)
        .filter_by(child_id=child_id)
        .first()
    )

    if not twin:
        twin = DigitalTwin(child_id=child_id)

    twin.attendance_score = scores.get("attendance_score")
    twin.academic_score = scores.get("academic_score")
    twin.behavior_score = scores.get("behavior_score")

    if forecast:
        twin.predicted_gpa = forecast.get("predicted_gpa")
        twin.failure_probability = forecast.get("failure_probability")
        twin.confidence = forecast.get("confidence")

    twin.risk_level = scores.get("risk_level")
    twin.explanation = {**scores, **(forecast or {})}
    twin.last_updated = datetime.utcnow()

    db.add(twin)
    db.commit()
