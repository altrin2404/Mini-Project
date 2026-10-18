from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.models.event import Event
from app.models.student_features import StudentFeatures

ATTENDANCE_EVENT_TYPES = ["attendance", "attendance_marked", "teacher_attendance"]
ACADEMIC_EVENT_TYPES = ["test", "academic", "test_score_recorded", "marks_uploaded"]
BEHAVIOR_EVENT_TYPES = ["behavior", "behavior_observation"]

def extract_attendance_features(db: Session, child_id: str):
    now = datetime.utcnow()
    last_30d = now - timedelta(days=30)
    last_7d = now - timedelta(days=7)
    prev_7d = now - timedelta(days=14)

    present_30d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ATTENDANCE_EVENT_TYPES),
        Event.payload["present"].as_boolean() == True,
        Event.timestamp >= last_30d
    ).scalar() or 0

    total_30d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ATTENDANCE_EVENT_TYPES),
        Event.timestamp >= last_30d
    ).scalar() or 0

    present_7d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ATTENDANCE_EVENT_TYPES),
        Event.payload["present"].as_boolean() == True,
        Event.timestamp >= last_7d
    ).scalar() or 0

    present_prev_7d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ATTENDANCE_EVENT_TYPES),
        Event.payload["present"].as_boolean() == True,
        Event.timestamp.between(prev_7d, last_7d)
    ).scalar() or 0

    attendance_rate_30d = (present_30d / total_30d) if total_30d else 1.0
    attendance_delta = present_7d - present_prev_7d

    return attendance_rate_30d, attendance_delta


def extract_academic_features(db: Session, child_id: str):
    now = datetime.utcnow()
    last_30d = now - timedelta(days=30)
    last_7d = now - timedelta(days=7)
    prev_7d = now - timedelta(days=14)

    avg_30d = db.query(
        func.avg((Event.payload["score"].as_float()))
    ).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ACADEMIC_EVENT_TYPES),
        Event.timestamp >= last_30d
    ).scalar() or 0.0

    avg_7d = db.query(
        func.avg((Event.payload["score"].as_float()))
    ).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ACADEMIC_EVENT_TYPES),
        Event.timestamp >= last_7d
    ).scalar() or 0.0

    avg_prev_7d = db.query(
        func.avg((Event.payload["score"].as_float()))
    ).filter(
        Event.child_id == child_id,
        Event.event_type.in_(ACADEMIC_EVENT_TYPES),
        Event.timestamp.between(prev_7d, last_7d)
    ).scalar() or 0.0

    delta = avg_7d - avg_prev_7d

    return avg_30d, delta


def extract_behavior_features(db: Session, child_id: str):
    now = datetime.utcnow()
    last_30d = now - timedelta(days=30)
    last_7d = now - timedelta(days=7)
    prev_7d = now - timedelta(days=14)

    neg_30d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(BEHAVIOR_EVENT_TYPES),
        Event.payload["severity"].as_integer() > 0,
        Event.timestamp >= last_30d
    ).scalar() or 0

    neg_7d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(BEHAVIOR_EVENT_TYPES),
        Event.payload["severity"].as_integer() > 0,
        Event.timestamp >= last_7d
    ).scalar() or 0

    neg_prev_7d = db.query(func.count()).filter(
        Event.child_id == child_id,
        Event.event_type.in_(BEHAVIOR_EVENT_TYPES),
        Event.payload["severity"].as_integer() > 0,
        Event.timestamp.between(prev_7d, last_7d)
    ).scalar() or 0

    delta = neg_7d - neg_prev_7d

    return neg_30d, delta


def update_student_features(db: Session, child_id: str, event=None):
    attendance_rate, attendance_delta = extract_attendance_features(db, child_id)
    avg_score, test_delta = extract_academic_features(db, child_id)
    neg_behavior, behavior_delta = extract_behavior_features(db, child_id)

    volatility = abs(test_delta)

    features = db.query(StudentFeatures).filter(
        StudentFeatures.child_id == child_id
    ).first()

    if not features:
        features = StudentFeatures(child_id=child_id)
        db.add(features)

    features.attendance_rate_30d = float(attendance_rate)
    features.attendance_delta = float(attendance_delta)
    features.avg_test_score_30d = float(avg_score)
    features.test_score_delta = float(test_delta)
    features.behavior_count_30d = float(neg_behavior)
    features.behavior_delta = float(behavior_delta)
    features.volatility_score = float(volatility)

    # Derived normalized metrics for twins (0.0 to 1.0 or percentage)
    features.attendance_norm = float(attendance_rate)
    features.attendance_30d = round(float(attendance_rate) * 100, 2)
    features.test_score_norm = round(min(1.0, float(avg_score) / 100.0 if avg_score > 1.0 else float(avg_score)), 2)
    features.test_score_30d = round(float(avg_score), 2)
    features.homework_norm = max(0.0, 1.0 - (float(neg_behavior) * 0.1))
    features.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(features)
    return features

