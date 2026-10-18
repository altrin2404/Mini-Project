from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from sqlalchemy.sql import func
from app.db.base import Base


class StudentFeatures(Base):
    __tablename__ = "student_features"

    child_id = Column(String, primary_key=True, index=True)

    attendance_7d = Column(Float)
    attendance_30d = Column(Float)

    homework_7d = Column(Float)
    homework_30d = Column(Float)

    test_score_7d = Column(Float)
    test_score_30d = Column(Float)

    attendance_delta = Column(Float)
    homework_delta = Column(Float)
    test_score_delta = Column(Float)

    attendance_norm = Column(Float, default=1.0)
    homework_norm = Column(Float, default=1.0)
    test_score_norm = Column(Float, default=0.0)

    # Additional feature engine fields
    attendance_rate_30d = Column(Float, default=1.0)
    avg_test_score_30d = Column(Float, default=0.0)
    behavior_count_30d = Column(Float, default=0.0)
    behavior_delta = Column(Float, default=0.0)
    volatility_score = Column(Float, default=0.0)

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

