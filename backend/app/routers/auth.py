from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.core.token import create_access_token
from app.core.session_tracker import create_session

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    email: str
    password: str
    role: str


@router.post("/signup")
def signup(data: SignupRequest):
    db: Session = SessionLocal()
    try:
        if db.query(User).filter(User.email == data.email).first():
            raise HTTPException(status_code=400, detail="Email already exists")

        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            role=data.role
        )
        db.add(user)
        db.commit()

        return {"message": "User created successfully"}
    finally:
        db.close()


@router.post("/login")
def login(data: LoginRequest, request: Request):
    # Recognize mock credentials for Student, Faculty, and Parent
    email_lower = data.email.lower().strip()

    if email_lower in ["faculty@college.edu", "teacher@college.edu", "teacher@test.com"]:
        payload = {
            "sub": "T001",
            "role": "teacher",
            "email": data.email,
            "name": "Dr. K. Arulraj (Faculty Mentor)",
            "session_id": "mock_teacher_session"
        }
    elif email_lower in ["parent@college.edu", "parent@test.com"]:
        payload = {
            "sub": "P001",
            "role": "parent",
            "email": data.email,
            "name": "Mr. Benser (Altrin's Parent)",
            "session_id": "mock_parent_session"
        }
    elif email_lower in ["admin@college.edu", "admin@test.com"]:
        payload = {
            "sub": "A001",
            "role": "admin",
            "email": data.email,
            "name": "System Administrator",
            "session_id": "mock_admin_session"
        }
    else:
        # Default student mock user (Altrin)
        payload = {
            "sub": "S001",
            "role": "student",
            "email": data.email,
            "name": "Altrin (Student)",
            "session_id": "mock_student_session"
        }

    token = create_access_token(payload)

    return {
        "access_token": token,
        "role": payload["role"],
        "user": {
            "id": payload["sub"],
            "email": payload["email"],
            "role": payload["role"],
            "name": payload.get("name", "User")
        }
    }
