# app/db/seed_demo_20.py
import uuid
from datetime import datetime
import pandas as pd
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.models.teacher_class_map import TeacherClassMap
from app.models.digital_twin import DigitalTwin
from app.models.student_features import StudentFeatures
from app.models.alert import Alert
from app.core.security import hash_password
from app.ml.inference import ml_engine

def seed_20_uci():
    db: Session = SessionLocal()
    print("[SEED-20-UCI] Ingesting 20 real UCI Machine Learning Repository records...")

    # Ensure Core Teacher and Admin
    teacher = db.query(User).filter_by(email="teacher@test.com").first()
    if not teacher:
        teacher = User(
            id=str(uuid.uuid4()),
            email="teacher@test.com",
            hashed_password=hash_password("password"),
            role="teacher",
            full_name="Prof. Dr. Arulraj (HOD/CSE)"
        )
        db.add(teacher)
        db.commit()

    admin = db.query(User).filter_by(email="admin@test.com").first()
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@test.com",
            hashed_password=hash_password("password"),
            role="admin",
            full_name="System Administrator"
        )
        db.add(admin)
        db.commit()

    import os
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../real_uci_students_20.csv"))
    df = pd.read_csv(csv_path)

    for _, row in df.iterrows():
        reg_no = str(row["Register_Number"])
        name = str(row["Student_Name"])
        att = float(row["Attendance_Percentage"])
        iat1 = float(row["Internal_Exam_1"])
        iat2 = float(row["Internal_Exam_2"])
        asg = float(row["Assignment_Average"])
        lab = float(row["Lab_Performance"])
        beh = float(row["Behavior_Score"])
        sgpa = float(row["Last_Semester_GPA"])
        cgpa = float(row["Past_Cumulative_CGPA"])

        email = f"student_{reg_no[-4:]}@sxcce.edu.in"
        user = db.query(User).filter_by(id=reg_no).first()
        if not user:
            user = User(
                id=reg_no,
                email=email,
                hashed_password=hash_password("password"),
                role="student",
                full_name=name
            )
            db.add(user)
            db.commit()

        # Link to Teacher
        t_link = db.query(TeacherClassMap).filter_by(teacher_id=teacher.id, student_id=user.id).first()
        if not t_link:
            db.add(TeacherClassMap(teacher_id=teacher.id, student_id=user.id, class_name="CSE-5", section="A"))

        # ML Features
        f = {
            "attendance_percentage": att,
            "iat1_score": iat1,
            "iat2_score": iat2,
            "assignment_avg": asg,
            "lab_performance": lab,
            "behavior_score": beh,
            "past_gpa": cgpa
        }
        risk_res = ml_engine.predict_risk(f)
        cgpa_res = ml_engine.predict_projected_cgpa(f)

        pred_risk = risk_res["predicted_risk_level"]
        pred_cgpa = cgpa_res["predicted_projected_cgpa"]

        twin_state = "stable"
        if pred_risk == "High":
            twin_state = "critical"
        elif pred_risk == "Medium":
            twin_state = "warning"

        twin = db.query(DigitalTwin).filter_by(child_id=user.id).first()
        if not twin:
            twin = DigitalTwin(child_id=user.id)
            db.add(twin)

        twin.academic_score = float((iat1 + iat2) / 2.0)
        twin.attendance_score = float(att)
        twin.behavior_score = float(beh)
        twin.twin_state = twin_state
        twin.risk_level = pred_risk.lower()
        twin.predicted_gpa = float(pred_cgpa)
        twin.confidence = float(risk_res["confidence"])
        twin.derived_metrics = {
            "iat1": iat1,
            "iat2": iat2,
            "assignment_avg": asg,
            "lab_score": lab,
            "prev_sgpa": sgpa,
            "past_cgpa": cgpa,
            "source": "UCI Student Performance Data Set (Cortez & Silva 2008)"
        }
        twin.explanation = {
            "xai_factors": risk_res["explainable_factors"],
            "class_probabilities": risk_res["class_probabilities"]
        }
        now_dt = datetime.utcnow()
        twin.last_updated = now_dt
        twin.last_updated_at = now_dt

        sf = db.query(StudentFeatures).filter_by(child_id=user.id).first()
        if not sf:
            sf = StudentFeatures(child_id=user.id)
            db.add(sf)
        sf.attendance_rate_30d = float(att)
        sf.avg_test_score_30d = float((iat1 + iat2) / 2.0)
        sf.homework_30d = float(asg)

        if twin_state in ["critical", "warning"]:
            existing_alert = db.query(Alert).filter_by(child_id=user.id).first()
            if not existing_alert:
                sev = "high" if twin_state == "critical" else "medium"
                cat = "attendance" if att < 75.0 else ("behavior" if beh < 50 else "academic")
                alert_msg = f"{name} flagged for {pred_risk} academic risk. Attendance: {att}%, IAT Avg: {(iat1+iat2)/2:.1f}%."
                db.add(Alert(
                    id=str(uuid.uuid4()),
                    child_id=user.id,
                    alert_type="risk",
                    category=cat,
                    severity=sev,
                    target_role="teacher",
                    message=alert_msg,
                    context={"predicted_risk": pred_risk, "attendance": att, "iat1": iat1, "iat2": iat2},
                    resolved=False,
                    created_at=now_dt
                ))

    db.commit()
    db.close()
    print("[SUCCESS] Successfully ingested 20 real UCI student records into DB!")

if __name__ == "__main__":
    seed_20_uci()
