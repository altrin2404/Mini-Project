from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
import os

from app.db.session import get_db
from app.models.user import User
from app.models.user_session import UserSession

# Load environment variables
load_dotenv()

bearer = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not set")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    if token == "mock_student_token" or token == "mock_token":
        return {
            "user_id": "S001",
            "role": "student",
        }
    if token == "mock_teacher_token":
        return {
            "user_id": "T001",
            "role": "teacher",
        }

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("user_id") or payload.get("sub")
        role = payload.get("role")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        # MOCK MODE: Return directly without DB check
        return {
            "user_id": str(user_id),
            "role": role,
            "email": payload.get("email")
        }

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
