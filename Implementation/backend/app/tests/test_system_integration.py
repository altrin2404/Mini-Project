import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# =========================================================================
# 3. SYSTEM & INTEGRATION TESTS: REST APIS & DIGITAL TWIN WORKFLOWS
# =========================================================================

def test_system_health():
    """Verify backend health endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "backend running"}

def test_api_predict_risk_endpoint():
    """System test for /api/ml/predict-risk REST endpoint."""
    payload = {
        "attendance_percentage": 90.0,
        "iat1_score": 85.0,
        "iat2_score": 88.0,
        "assignment_avg": 82.0,
        "lab_performance": 90.0,
        "behavior_score": 90.0,
        "past_gpa": 8.5
    }
    response = client.post("/api/ml/predict-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_risk_level"] in ["Low", "Medium", "High"]
    assert "class_probabilities" in data
    assert "explainable_factors" in data

def test_api_predict_cgpa_endpoint():
    """System test for /api/ml/predict-cgpa (Ridge Regression endpoint)."""
    payload = {
        "attendance_percentage": 85.0,
        "iat1_score": 80.0,
        "iat2_score": 82.0,
        "past_gpa": 8.0
    }
    response = client.post("/api/ml/predict-cgpa", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_projected_cgpa" in data
    assert 0.0 <= data["predicted_projected_cgpa"] <= 10.0

def test_api_what_if_simulation_endpoint():
    """System test for /api/ml/what-if-simulate endpoint."""
    payload = {
        "baseline": {
            "attendance_percentage": 65.0,
            "iat1_score": 45.0,
            "iat2_score": 50.0,
            "assignment_avg": 60.0,
            "lab_performance": 65.0,
            "behavior_score": 75.0,
            "past_gpa": 6.2
        },
        "adjustments": {
            "iat2_score": 80.0
        }
    }
    response = client.post("/api/ml/what-if-simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "baseline" in data
    assert "simulated" in data
    assert "impact_summary" in data

def test_api_model_benchmarks_endpoint():
    """System test for /api/ml/model-metrics endpoint."""
    response = client.get("/api/ml/model-metrics")
    assert response.status_code == 200
    data = response.json()
    assert "ridge_semester_gpa" in data
    assert "ridge_cumulative_cgpa" in data
    assert "random_forest" in data

def test_api_upload_preview_and_commit():
    """End-to-End System test: Upload CSV, Preview Auto-mapping, and Commit to Digital Twins."""
    csv_content = (
        b"Roll_No,Student_Name,Attendance_Pct,Internal_1,Internal_2\n"
        b"TEST_STUDENT_01,Test User Alpha,92.0%,85,88\n"
        b"TEST_STUDENT_02,Test User Beta,55.0%,42,46\n"
    )

    # 1. Preview
    files = {"file": ("test_upload.csv", csv_content, "text/csv")}
    preview_res = client.post("/api/upload/preview", files=files)
    assert preview_res.status_code == 200
    preview_json = preview_res.json()
    assert preview_json["is_valid"] is True
    assert preview_json["total_rows"] == 2

    # 2. Commit batch with inferred mappings
    import json
    mappings_str = json.dumps(preview_json["inferred_mappings"])
    commit_files = {"file": ("test_upload.csv", csv_content, "text/csv")}
    commit_res = client.post(
        "/api/upload/commit",
        files=commit_files,
        data={"mappings_json": mappings_str}
    )
    assert commit_res.status_code == 200
    commit_json = commit_res.json()
    assert commit_json["status"] == "success"
    assert commit_json["processed_records"] == 2
    assert len(commit_json["summary"]) == 2
