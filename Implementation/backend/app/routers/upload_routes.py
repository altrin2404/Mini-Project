import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.db.session import get_db
from app.core.dynamic_importer import DynamicDataParser
from app.ml.inference import ml_engine
from app.models.digital_twin import DigitalTwin
from app.models.event import Event
from app.models.student_features import StudentFeatures
from datetime import datetime

router = APIRouter(prefix="/api/upload", tags=["Dynamic Data Ingestion"])

@router.post("/preview")
async def preview_and_map_file(file: UploadFile = File(...)):
    """
    Accepts arbitrary CSV, Excel (.xlsx, .xls), or TSV files.
    Fuzzy-matches headers and returns preview + recommended column mappings.
    """
    allowed_exts = (".csv", ".xlsx", ".xls", ".tsv")
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file.filename}'. Allowed: CSV, XLSX, XLS, TSV"
        )

    try:
        content = await file.read()
        preview = DynamicDataParser.parse_and_preview(content, file.filename, preview_rows=6)
        return preview
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

@router.post("/commit")
async def commit_batch_records(
    file: UploadFile = File(...),
    mappings_json: str = Form(..., description="JSON string mapping canonical fields to user raw columns"),
    db: Session = Depends(get_db)
):
    """
    Ingests students from the uploaded file with confirmed mappings.
    Immediately updates the Digital Twin, runs Ridge Regression + Random Forest,
    and logs twin events.
    """
    try:
        confirmed_mappings = json.loads(mappings_json)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid mappings_json payload. Expected valid JSON.")

    content = await file.read()
    records = DynamicDataParser.extract_standardized_records(content, file.filename, confirmed_mappings)

    if not records:
        raise HTTPException(status_code=400, detail="No valid student records could be extracted from this file.")

    processed_count = 0
    updated_twins = []

    for rec in records:
        student_id = str(rec["student_id"])

        # Run ML predictions using the trained Ridge & Random Forest models
        ml_features = {
            "attendance_percentage": rec["attendance_percentage"],
            "iat1_score": rec["iat1_score"],
            "iat2_score": rec["iat2_score"],
            "assignment_avg": rec["assignment_avg"],
            "lab_performance": rec["lab_performance"],
            "behavior_score": rec["behavior_score"],
            "past_gpa": rec["past_gpa"]
        }

        risk_res = ml_engine.predict_risk(ml_features)
        cgpa_res = ml_engine.predict_projected_cgpa(ml_features)

        predicted_risk = risk_res["predicted_risk_level"]
        predicted_cgpa = cgpa_res["predicted_projected_cgpa"]

        # Map to Digital Twin state
        twin_state = "stable"
        if predicted_risk == "High":
            twin_state = "critical"
        elif predicted_risk == "Medium":
            twin_state = "warning"

        # Update or Insert DigitalTwin in DB
        twin = db.query(DigitalTwin).filter(DigitalTwin.child_id == student_id).first()
        if not twin:
            twin = DigitalTwin(child_id=student_id)
            db.add(twin)

        twin.academic_score = float((rec["iat1_score"] + rec["iat2_score"]) / 2.0)
        twin.attendance_score = float(rec["attendance_percentage"])
        twin.behavior_score = float(rec["behavior_score"])
        twin.twin_state = twin_state
        twin.risk_level = predicted_risk.lower()
        twin.predicted_gpa = float(predicted_cgpa)
        twin.confidence = float(risk_res["confidence"])
        twin.explanation = {
            "xai_factors": risk_res["explainable_factors"],
            "class_probabilities": risk_res["class_probabilities"],
            "source_file": file.filename
        }
        twin.last_updated = datetime.utcnow()
        twin.last_updated_at = datetime.utcnow()

        # Record ingestion event
        ev = Event(
            child_id=student_id,
            event_type="batch_file_ingestion",
            payload={
                "filename": file.filename,
                "attendance": rec["attendance_percentage"],
                "iat1": rec["iat1_score"],
                "iat2": rec["iat2_score"],
                "projected_cgpa": predicted_cgpa,
                "risk": predicted_risk
            },
            timestamp=datetime.utcnow()
        )
        db.add(ev)

        # Update StudentFeatures record
        sf = db.query(StudentFeatures).filter(StudentFeatures.child_id == student_id).first()
        if not sf:
            sf = StudentFeatures(child_id=student_id)
            db.add(sf)
        sf.attendance_rate_30d = float(rec["attendance_percentage"])
        sf.avg_test_score_30d = float((rec["iat1_score"] + rec["iat2_score"]) / 2.0)
        sf.homework_30d = float(rec["assignment_avg"])

        processed_count += 1
        updated_twins.append({
            "student_id": student_id,
            "student_name": rec.get("student_name", f"Student {student_id}"),
            "predicted_risk": predicted_risk,
            "twin_state": twin_state,
            "projected_cgpa": predicted_cgpa
        })

    db.commit()

    return {
        "status": "success",
        "filename": file.filename,
        "processed_records": processed_count,
        "summary": updated_twins
    }
