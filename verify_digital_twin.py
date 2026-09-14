import sys
import os
from datetime import datetime
import json

# Mocking the environment for SQLite
os.environ["DATABASE_URL"] = "sqlite:///test_twin.db"

# Add directories to path
sys.path.append(os.path.join(os.getcwd(), "ml-engine"))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Event, DigitalTwin
from main import run

def setup_test_db():
    engine = create_engine("sqlite:///test_twin.db")
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)()

def inject_test_data(session):
    # Student 1: Good attendance, good grades -> Low Risk, High GPA
    session.add(Event(
        id="e1", child_id="S001", event_type="attendance_marked",
        payload={"present": True}, created_at=datetime.utcnow(), processed=False
    ))
    session.add(Event(
        id="e2", child_id="S001", event_type="marks_uploaded",
        payload={"score": 90, "max_score": 100}, created_at=datetime.utcnow(), processed=False
    ))
    
    # Student 2: Poor attendance, low grades -> High Risk, Low GPA
    session.add(Event(
        id="e3", child_id="S002", event_type="attendance_marked",
        payload={"present": False}, created_at=datetime.utcnow(), processed=False
    ))
    session.add(Event(
        id="e4", child_id="S002", event_type="marks_uploaded",
        payload={"score": 30, "max_score": 100}, created_at=datetime.utcnow(), processed=False
    ))
    
    session.commit()

def verify_results(session):
    print("\n--- Digital Twin Verification Results ---")
    twins = session.query(DigitalTwin).all()
    for t in twins:
        print(f"Child ID: {t.child_id}")
        print(f"  Risk Level: {t.risk_level}")
        print(f"  Predicted GPA: {t.predicted_gpa}")
        print(f"  Failure Probability: {t.failure_probability}")
        print(f"  Confidence: {t.confidence}")
        print("-" * 40)

if __name__ == "__main__":
    session = setup_test_db()
    
    print("Injecting test events...")
    inject_test_data(session)
    
    print("Running ML Engine...")
    run() # This should process the events and update digital_twins table
    
    # Re-open session to get fresh data
    session.close()
    engine = create_engine("sqlite:///test_twin.db")
    session = sessionmaker(bind=engine)()
    verify_results(session)
    session.close()
