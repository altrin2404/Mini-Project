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
    # Mocking login for development/run mode
    payload = {
        "sub": "S001",
        "role": "student",
        "email": data.email,
        "session_id": "mock_session_id"
    }

    if data.email == "teacher@test.com":
        payload.update({
            "sub": "T001",
            "role": "teacher"
        })
    elif data.email == "admin@test.com":
        payload.update({
            "sub": "A001",
            "role": "admin"
        })
    elif data.email == "parent@test.com":
        payload.update({
            "sub": "P001",
            "role": "parent"
        })

    token = create_access_token(payload)

    return {
        "access_token": token,
        "role": payload["role"],
        "user": {
            "id": payload["sub"],
            "email": payload["email"],
            "role": payload["role"]
        }
    }
