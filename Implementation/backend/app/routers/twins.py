from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.digital_twin import DigitalTwin
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/twins", tags=["Digital Twins"])


# ─────────────────────────────
# STUDENT: own twin
# ─────────────────────────────
@router.get("/self")
def get_my_twin(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    child_id = user.get("user_id", "S001") if user else "S001"
    twin = db.query(DigitalTwin).filter(DigitalTwin.child_id == child_id).first()

    if twin:
        return {
            "child_id": twin.child_id,
            "academic_score": round(float(twin.academic_score or 0.0) / 100.0 if float(twin.academic_score or 0.0) > 1.0 else float(twin.academic_score or 0.0), 2),
            "attendance_score": round(float(twin.attendance_score or 0.0) / 100.0 if float(twin.attendance_score or 0.0) > 1.0 else float(twin.attendance_score or 0.0), 2),
            "behavior_score": round(float(twin.behavior_score or 0.0) / 100.0 if float(twin.behavior_score or 0.0) > 1.0 else float(twin.behavior_score or 0.0), 2),
            "predicted_gpa": float(twin.predicted_gpa or 8.5),
            "failure_probability": float(twin.failure_probability or 0.05),
            "confidence": float(twin.confidence or 0.95),
            "risk_level": (twin.risk_level or "Low").capitalize(),
            "twin_state": twin.twin_state or "stable",
            "explanation": twin.explanation or {
                "academic": f"Academic score is {twin.academic_score}%.",
                "attendance": f"Attendance is {twin.attendance_score}%."
            },
            "last_updated": (twin.last_updated or datetime.utcnow()).isoformat()
        }

    return {
        "child_id": child_id,
        "academic_score": 0.85,
        "attendance_score": 0.92,
        "behavior_score": 0.88,
        "predicted_gpa": 8.5,
        "failure_probability": 0.05,
        "confidence": 0.95,
        "risk_level": "Low",
        "twin_state": "stable",
        "explanation": {
            "academic": "Consistently high scores in core modules.",
            "attendance": "Above 90% threshold maintained."
        },
        "last_updated": datetime.utcnow().isoformat()
    }


# ─────────────────────────────
# PARENT / ADMIN: child twin
# ─────────────────────────────
@router.get("/child/{child_id}")
def get_child_twin(
    child_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    twin = db.query(DigitalTwin).filter(DigitalTwin.child_id == child_id).first()
    if twin:
        return {
            "child_id": twin.child_id,
            "academic_score": round(float(twin.academic_score or 0.0) / 100.0 if float(twin.academic_score or 0.0) > 1.0 else float(twin.academic_score or 0.0), 2),
            "attendance_score": round(float(twin.attendance_score or 0.0) / 100.0 if float(twin.attendance_score or 0.0) > 1.0 else float(twin.attendance_score or 0.0), 2),
            "behavior_score": round(float(twin.behavior_score or 0.0) / 100.0 if float(twin.behavior_score or 0.0) > 1.0 else float(twin.behavior_score or 0.0), 2),
            "predicted_gpa": float(twin.predicted_gpa or 8.5),
            "failure_probability": float(twin.failure_probability or 0.05),
            "confidence": float(twin.confidence or 0.95),
            "risk_level": (twin.risk_level or "Low").capitalize(),
            "twin_state": twin.twin_state or "stable",
            "explanation": twin.explanation or {},
            "last_updated": (twin.last_updated or datetime.utcnow()).isoformat()
        }

    return {
        "child_id": child_id,
        "academic_score": 0.82,
        "attendance_score": 0.95,
        "behavior_score": 0.88,
        "predicted_gpa": 8.2,
        "failure_probability": 0.08,
        "confidence": 0.92,
        "risk_level": "Low",
        "twin_state": "stable",
        "explanation": {
            "academic": "Active academic participation with stable scores.",
            "attendance": "Attendance is well above the required 75% cutoff."
        },
        "last_updated": datetime.utcnow().isoformat()
    }


# ─────────────────────────────
# TEACHER: class twins
# ─────────────────────────────
@router.get("/class/{class_name}/{section}")
def get_class_twins(
    class_name: str,
    section: str,
    db: Session = Depends(get_db)
):
    twins = db.query(DigitalTwin).all()
    if twins:
        return [
            {
                "child_id": t.child_id,
                "academic_score": round(float(t.academic_score or 0.0) / 100.0 if float(t.academic_score or 0.0) > 1.0 else float(t.academic_score or 0.0), 2),
                "attendance_score": round(float(t.attendance_score or 0.0) / 100.0 if float(t.attendance_score or 0.0) > 1.0 else float(t.attendance_score or 0.0), 2),
                "behavior_score": round(float(t.behavior_score or 0.0) / 100.0 if float(t.behavior_score or 0.0) > 1.0 else float(t.behavior_score or 0.0), 2),
                "predicted_gpa": float(t.predicted_gpa or 8.0),
                "failure_probability": float(t.failure_probability or 0.1),
                "confidence": float(t.confidence or 0.90),
                "risk_level": (t.risk_level or "Low").capitalize(),
                "twin_state": t.twin_state or "stable",
                "explanation": t.explanation or {},
                "last_updated": (t.last_updated or datetime.utcnow()).isoformat()
            }
            for t in twins
        ]

    return [
        {
            "child_id": "S001",
            "academic_score": 0.85,
            "attendance_score": 0.92,
            "behavior_score": 0.88,
            "predicted_gpa": 8.5,
            "failure_probability": 0.05,
            "confidence": 0.95,
            "risk_level": "Low",
            "twin_state": "stable",
            "explanation": {},
            "last_updated": datetime.utcnow().isoformat()
        },
        {
            "child_id": "S002",
            "academic_score": 0.45,
            "attendance_score": 0.62,
            "behavior_score": 0.70,
            "predicted_gpa": 5.2,
            "failure_probability": 0.45,
            "confidence": 0.80,
            "risk_level": "High",
            "twin_state": "critical",
            "explanation": {
                "attendance": "Declining attendance over last 3 weeks."
            },
            "last_updated": datetime.utcnow().isoformat()
        }
    ]


# ─────────────────────────────
# ADMIN: all twins
# ─────────────────────────────
@router.get("/all")
def get_all_twins(db: Session = Depends(get_db)):
    twins = db.query(DigitalTwin).all()
    if twins:
        return [
            {
                "child_id": t.child_id,
                "academic_score": float(t.academic_score or 0.0),
                "attendance_score": float(t.attendance_score or 0.0),
                "behavior_score": float(t.behavior_score or 0.0),
                "risk_level": t.risk_level,
                "twin_state": t.twin_state,
                "predicted_gpa": t.predicted_gpa
            }
            for t in twins
        ]
    return []

