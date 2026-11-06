from sqlalchemy import Column, String, Boolean, DateTime, func, JSON
from datetime import datetime
import uuid

from app.db.base import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    child_id = Column(String, nullable=True)
    actor_id = Column(String, nullable=True)

    event_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)

    timestamp = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
