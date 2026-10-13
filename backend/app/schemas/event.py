from pydantic import BaseModel, Field, validator
from typing import Dict, Optional, Literal, Any
from datetime import datetime


# --------------------
# Payload Schemas
# --------------------

class AttendancePayload(BaseModel):
    present: bool


class TestPayload(BaseModel):
    score: float = Field(..., ge=0, le=100)


class BehaviorPayload(BaseModel):
    note: str


class EventCreate(BaseModel):
    child_id: Optional[str] = None
    event_type: str
    payload: Dict[str, Any]


# --------------------
# Event Response Schema
# --------------------

class EventResponse(BaseModel):
    id: str
    child_id: Optional[str] = None
    event_type: str
    payload: Dict[str, Any]
    timestamp: datetime
    processed: bool

    class Config:
        from_attributes = True
