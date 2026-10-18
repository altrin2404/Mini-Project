from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db
from app.core.dependencies import get_current_user

from app.models.parent_child_map import ParentChildMap
from app.models.teacher_class_map import TeacherClassMap
from app.models.digital_twin import DigitalTwin
from app.models.risk_score import RiskScore
from app.models.student_features import StudentFeatures
from app.models.alert import Alert
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ─────────────────────────────
# ROLE GUARD
# ─────────────────────────────
def require_roles(roles: list):
    def checker(user=Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return checker


@router.get("/admin/health")
def admin_health(user=Depends(require_roles(["admin"]))):
    return {
        "status": "Operational",
        "uptime": "99.99%",
        "api_response": 85,
        "storage_usage": 65,
        "latency": 12,
        "error_rate": 0.1
    }


@router.get("/admin/audit")
def admin_audit(user=Depends(require_roles(["admin"]))):
    return {
        "events": [
            {"id": "EVT-0012345", "timestamp": "2023-10-26 14:30:05", "source": "Auth", "type": "Login", "status": "Success"},
            {"id": "EVT-0012346", "timestamp": "2023-10-26 14:31:22", "source": "DB", "type": "Query", "status": "Slow"},
            {"id": "EVT-0012347", "timestamp": "2023-10-26 14:35:10", "source": "API", "type": "Update", "status": "Critical"},
        ]
    }


@router.get("/teacher/summary")
def teacher_summary(user=Depends(require_roles(["teacher"]))):
    return {
        "total_students": 28,
        "engagement": 85,
        "attendance": 92,
        "alerts": 4,
        "at_risk": [
            {"name": "Alex Kim", "risk": "High"},
            {"name": "Maria Perez", "risk": "Moderate"},
            {"name": "John Doe", "risk": "Low"},
        ]
    }


# ─────────────────────────────
# BASIC SELF CHECK
# ─────────────────────────────
@router.get("/me")
def my_dashboard(user=Depends(get_current_user)):
    return {
        "user_id": user["user_id"],
        "role": user["role"]
    }


# ─────────────────────────────
# STUDENT DASHBOARD
# ─────────────────────────────
@router.get("/student")
def student_dashboard(
    user=Depends(require_roles(["student"])),
    db: Session = Depends(get_db)
):
    child_id = user["user_id"]
    twin = db.query(DigitalTwin).filter(DigitalTwin.child_id == child_id).first()
    risk = db.query(RiskScore).filter(RiskScore.child_id == child_id).first()
    features = db.query(StudentFeatures).filter(StudentFeatures.child_id == child_id).first()
    alerts = db.query(Alert).filter(Alert.child_id == child_id, Alert.resolved == False).order_by(Alert.created_at.desc()).all()

    acad_norm = round(float(twin.academic_score or 82.0) / 100.0 if float(twin.academic_score or 0) > 1.0 else float(twin.academic_score or 0.82), 2) if twin else 0.82
    att_norm = round(float(twin.attendance_score or 95.0) / 100.0 if float(twin.attendance_score or 0) > 1.0 else float(twin.attendance_score or 0.95), 2) if twin else 0.95
    beh_norm = round(float(twin.behavior_score or 88.0) / 100.0 if float(twin.behavior_score or 0) > 1.0 else float(twin.behavior_score or 0.88), 2) if twin else 0.88

    return {
        "student_id": child_id,
        "twin": {
            "academic_score": acad_norm,
            "attendance_score": att_norm,
            "behavior_score": beh_norm,
            "state": (twin.twin_state.capitalize() if twin and twin.twin_state else "Stable"),
        },
        "forecast": {
            "predicted_gpa": float(twin.predicted_gpa or 3.8) if twin else 3.8,
            "failure_probability": float(twin.failure_probability or 0.05) if twin else 0.05,
            "confidence": float(twin.confidence or 0.92) if twin else 0.92,
        },
        "risk": {
            "attendance_risk": float(risk.attendance_risk or 5.0) if risk else 5.0,
            "academic_risk": float(risk.academic_risk or 15.0) if risk else 15.0,
            "behavior_risk": float(risk.behavior_risk or 10.0) if risk else 10.0,
            "volatility_risk": float(risk.volatility_risk or 8.0) if risk else 8.0,
            "total_risk": float(risk.total_risk or 12.0) if risk else 12.0,
        },
        "features": {
            "attendance_7d": float(features.attendance_7d or 96.5) if features else 96.5,
            "attendance_30d": float(features.attendance_30d or 94.2) if features else 94.2,
            "attendance_delta": float(features.attendance_delta or 2.3) if features else 2.3,
            "test_score_7d": float(features.test_score_7d or 85.0) if features else 85.0,
            "test_score_30d": float(features.test_score_30d or 78.5) if features else 78.5,
            "test_score_delta": float(features.test_score_delta or 6.5) if features else 6.5,
        },
        "alerts": [
            {
                "id": a.id,
                "severity": a.severity,
                "type": a.alert_type,
                "message": a.message,
                "created_at": a.created_at.isoformat() if a.created_at else "2026-03-15T10:00:00Z"
            }
            for a in alerts
        ] if alerts else [
            {
                "id": "A1",
                "severity": "info",
                "type": "academic",
                "message": "Excellent progress in Mathematics this week.",
                "created_at": "2026-03-15T10:00:00Z"
            }
        ]
    }



# ─────────────────────────────
# PARENT DASHBOARD
# ─────────────────────────────
@router.get("/parent")
def parent_dashboard(
    user=Depends(require_roles(["parent"])),
    db: Session = Depends(get_db)
):
    parent_id = user["user_id"]

    return {
        "parent_id": parent_id,
        "children": [
            {
                "child_id": "ST1",
                "full_name": "Alex Kim",
                "twin_state": "Stable",
                "academic_score": 0.82,
                "attendance_score": 0.95,
                "behavior_score": 0.88,
                "risk_score": 12.0,
                "active_alerts": 2
            }
        ],
        "system_alerts": [
            {
                "id": "P1",
                "type": "Critical",
                "title": "Behavioral Concern",
                "message": "Alex exhibited an unusual level of withdrawal during group activities today.",
                "created_at": "2026-03-15T10:30:00Z"
            }
        ]
    }


# ─────────────────────────────
# TEACHER DASHBOARD (CORRECTED)
# ─────────────────────────────
@router.get("/teacher")
def teacher_dashboard(
    user=Depends(require_roles(["teacher"])),
    db: Session = Depends(get_db)
):
    teacher_id = user["user_id"]

    return {
        "teacher_id": teacher_id,
        "students": [
            {"id": "S1", "name": "Alex Kim", "risk": "High", "initials": "AK", "status": "Requires attention"},
            {"id": "S2", "name": "Sarah Lee", "risk": "High", "initials": "SL", "status": "Dipping attendance"},
            {"id": "S3", "name": "Emily Chen", "risk": "High", "initials": "EC", "status": "Test score drop"},
            {"id": "M1", "name": "Maria Perez", "risk": "Moderate", "initials": "MP", "status": "Steady progress"},
            {"id": "M2", "name": "Robert Williams", "risk": "Moderate", "initials": "RW", "status": "New joiner"},
            {"id": "L1", "name": "Chris Jordan", "risk": "Low", "initials": "CJ", "status": "Exceeding targets"}
        ]
    }


# ─────────────────────────────
# ADMIN DASHBOARD
# ─────────────────────────────
@router.get("/admin")
def admin_dashboard(
    user=Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    return {
        "system_status": "healthy",
        "enrollment_trend": [980, 1020, 1080, 1150, 1240],
        "risk_distribution": [
            {"grade": "9th", "score": 24},
            {"grade": "10th", "score": 28},
            {"grade": "11th", "score": 18},
            {"grade": "12th", "score": 14}
        ],
        "stats": {
            "total_users": 1240,
            "active_alerts": 42,
            "avg_risk": 32.5
        }
    }
