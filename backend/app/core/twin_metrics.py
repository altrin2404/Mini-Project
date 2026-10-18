from sqlalchemy.orm import Session
from datetime import datetime
from app.models.digital_twin import DigitalTwin
from app.models.student_features import StudentFeatures


class TwinMetrics:
    def __init__(self, academic: float = 0.0, attendance: float = 0.0, behavior: float = 100.0):
        self.academic = round(float(academic), 2)
        self.attendance = round(float(attendance), 2)
        self.behavior = round(float(behavior), 2)

    def dict(self):
        return {
            "academic": self.academic,
            "attendance": self.attendance,
            "behavior": self.behavior
        }


def compute_twin_metrics(db: Session, child_id: str) -> TwinMetrics:
    """
    Convert student features into normalized twin scores (0–100) and return TwinMetrics
    """
    twin = (
        db.query(DigitalTwin)
        .filter(DigitalTwin.child_id == child_id)
        .first()
    )

    features = (
        db.query(StudentFeatures)
        .filter(StudentFeatures.child_id == child_id)
        .first()
    )

    attendance = 95.0
    academic = 75.0
    behavior = 100.0

    if features:
        if features.attendance_30d is not None and features.attendance_30d > 0:
            attendance = float(features.attendance_30d)
        elif features.attendance_rate_30d is not None:
            attendance = float(features.attendance_rate_30d) * 100.0

        if features.avg_test_score_30d is not None and features.avg_test_score_30d > 0:
            academic = float(features.avg_test_score_30d)
        elif features.test_score_30d is not None and features.test_score_30d > 0:
            academic = float(features.test_score_30d)

        neg_behavior = features.behavior_count_30d or 0.0
        behavior = max(0.0, 100.0 - (float(neg_behavior) * 10.0))

    attendance = max(0.0, min(100.0, attendance))
    academic = max(0.0, min(100.0, academic))
    behavior = max(0.0, min(100.0, behavior))

    metrics = TwinMetrics(academic=academic, attendance=attendance, behavior=behavior)

    if twin:
        twin.attendance_score = metrics.attendance
        twin.academic_score = metrics.academic
        twin.behavior_score = metrics.behavior
        twin.derived_metrics = {
            "attendance_rate": round(attendance / 100.0, 2),
            "academic_avg": academic,
            "behavior_score": behavior,
            "volatility": getattr(features, "volatility_score", 0.0) if features else 0.0
        }
        twin.last_updated_at = datetime.utcnow()
        db.commit()

    return metrics

