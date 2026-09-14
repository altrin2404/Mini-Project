from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class DigitalTwinOut(BaseModel):
    child_id: str
    academic_score: Optional[float]
    attendance_score: Optional[float]
    behavior_score: Optional[float]
    predicted_gpa: Optional[float] = 0.0
    failure_probability: Optional[float] = 0.0
    confidence: Optional[float] = 0.0
    risk_level: str
    explanation: Dict
    last_updated: datetime

    class Config:
        from_attributes = True

