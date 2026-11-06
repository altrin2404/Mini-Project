import pytest
from app.ml.inference import ml_engine
from app.core.dynamic_importer import DynamicDataParser

# =========================================================================
# 1. UNIT TESTS: MACHINE LEARNING & XAI INFERENCE
# =========================================================================

def test_ml_models_loaded():
    """Verify that serialized Ridge Regression and Random Forest models are loaded."""
    assert ml_engine.ridge_sem_model is not None, "Ridge Semester GPA model should be loaded"
    assert ml_engine.ridge_cgpa_model is not None, "Ridge CGPA model should be loaded"
    assert ml_engine.rf_model is not None, "Random Forest model should be loaded"
    assert ml_engine.metrics is not None, "Model benchmarks metrics should be loaded"

def test_ridge_cgpa_prediction_high_performer():
    """Ridge regression should project high SGPA and CGPA for strong student scores."""
    payload = {
        "attendance_percentage": 96.0,
        "iat1_score": 92.0,
        "iat2_score": 95.0,
        "assignment_avg": 90.0,
        "lab_performance": 94.0,
        "behavior_score": 95.0,
        "past_cgpa": 9.2,
        "prev_sem_gpa": 9.0
    }
    res = ml_engine.predict_projected_cgpa(payload)
    assert "predicted_projected_cgpa" in res
    assert "predicted_semester_gpa" in res
    assert 8.5 <= res["predicted_projected_cgpa"] <= 10.0
    assert 8.5 <= res["predicted_semester_gpa"] <= 10.0

def test_ridge_cgpa_prediction_low_performer():
    """Ridge regression should accurately reflect lower academic projections."""
    payload = {
        "attendance_percentage": 55.0,
        "iat1_score": 40.0,
        "iat2_score": 42.0,
        "assignment_avg": 50.0,
        "lab_performance": 52.0,
        "behavior_score": 70.0,
        "past_gpa": 5.4
    }
    res = ml_engine.predict_projected_cgpa(payload)
    assert res["predicted_projected_cgpa"] < 6.5

def test_random_forest_risk_classification():
    """Random Forest should classify high-risk conditions and provide XAI attribution."""
    at_risk_payload = {
        "attendance_percentage": 52.0,
        "iat1_score": 38.0,
        "iat2_score": 42.0,
        "assignment_avg": 50.0,
        "lab_performance": 55.0,
        "behavior_score": 75.0,
        "past_gpa": 5.5
    }
    res = ml_engine.predict_risk(at_risk_payload)
    assert res["predicted_risk_level"] == "High"
    assert res["confidence"] > 60.0
    assert "explainable_factors" in res
    # First factor should be a major negative driver
    assert len(res["explainable_factors"]) > 0
    assert res["explainable_factors"][0]["difference"] < 0

def test_what_if_simulation_sandbox():
    """What-If sandbox should reflect positive score adjustments."""
    baseline = {
        "attendance_percentage": 58.0,
        "iat1_score": 45.0,
        "iat2_score": 45.0,
        "assignment_avg": 60.0,
        "lab_performance": 60.0,
        "behavior_score": 80.0,
        "past_gpa": 5.8
    }
    adjustments = {
        "iat2_score": 85.0,
        "attendance_percentage": 78.0
    }
    sim = ml_engine.simulate_what_if(baseline, adjustments)
    assert sim["impact_summary"]["status_improved"] is True
    assert sim["impact_summary"]["cgpa_delta"] > 0
    assert sim["simulated"]["projected_cgpa"] > sim["baseline"]["projected_cgpa"]

# =========================================================================
# 2. UNIT TESTS: DYNAMIC / SCHEMA-AGNOSTIC FILE PARSER
# =========================================================================

def test_dynamic_parser_fuzzy_header_detection():
    """Fuzzy column mapper should match non-standard header formats."""
    sample_csv = (
        b"Register_Number,Candidate_Full_Name,Attnd_Percentage,CIA_1_Marks,CIA_2_Marks\n"
        b"96222301,Kavitha S,88.0%,78,85\n"
        b"96222302,Rahul M,62.5%,40,48\n"
    )
    preview = DynamicDataParser.parse_and_preview(sample_csv, "test_file.csv")
    mappings = preview["inferred_mappings"]

    assert mappings["student_id"] == "Register_Number"
    assert mappings["student_name"] == "Candidate_Full_Name"
    assert mappings["attendance_percentage"] == "Attnd_Percentage"
    assert mappings["iat1_score"] == "CIA_1_Marks"
    assert mappings["iat2_score"] == "CIA_2_Marks"

def test_dynamic_parser_record_extraction():
    """Parser should sanitize percentages and strings into clean numeric records."""
    sample_csv = (
        b"Stud_ID,Name,Attendance_Rate,Internal_Exam_1,Internal_Exam_2\n"
        b"S101,John Doe,76.5%,65,72\n"
    )
    preview = DynamicDataParser.parse_and_preview(sample_csv, "students.csv")
    records = DynamicDataParser.extract_standardized_records(sample_csv, "students.csv", preview["inferred_mappings"])

    assert len(records) == 1
    assert records[0]["student_id"] == "S101"
    assert records[0]["attendance_percentage"] == 76.5
    assert records[0]["iat1_score"] == 65.0
    assert records[0]["iat2_score"] == 72.0
