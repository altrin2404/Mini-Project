from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.digital_twin import DigitalTwin
from app.schemas.twin import DigitalTwinOut
from app.core.dependencies import get_current_user
from app.core.ownership import is_parent_of_child, is_teacher_of_class

router = APIRouter(prefix="/twins", tags=["Digital Twins"])


from datetime import datetime

# ─────────────────────────────
# STUDENT: own twin
# ─────────────────────────────
@router.get("/self")
def get_my_twin():
    return {
        "child_id": "S001",
        "academic_score": 0.85,
        "attendance_score": 0.92,
        "behavior_score": 0.88,
        "predicted_gpa": 8.5,
        "failure_probability": 0.05,
        "confidence": 0.95,
        "risk_level": "Low",
        "explanation": {
            "academic": "Consistently high scores in core modules.",
            "attendance": "Above 90% threshold maintained."
        },
        "last_updated": datetime.utcnow().isoformat()
    }


# ─────────────────────────────
# PARENT: child twin
# ─────────────────────────────
# This endpoint is removed as it was not included in the mock data instructions.
# @router.get("/child/{child_id}", response_model=DigitalTwinOut)
# def get_child_twin(
#     child_id: str,
#     db: Session = Depends(get_db),
#     current_user=Depends(get_current_user)
# ):
#     if current_user["role"] != "parent":
#         raise HTTPException(status_code=403, detail="Only parents allowed")

#     if not is_parent_of_child(db, current_user["user_id"], child_id):
#         raise HTTPException(status_code=403, detail="Unauthorized child access")

#     twin = db.query(DigitalTwin).filter_by(child_id=child_id).first()
#     if not twin:
#         raise HTTPException(status_code=404, detail="Twin not found")

#     return twin


# ─────────────────────────────
# TEACHER: class twins
# ─────────────────────────────
@router.get("/class/{class_name}/{section}")
def get_class_twins(class_name: str, section: str):
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
def get_all_twins():
    return []
