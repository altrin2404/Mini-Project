from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from app.ml.inference import ml_engine

router = APIRouter(prefix="/api/ml", tags=["Machine Learning & XAI"])

class StudentFeaturesPayload(BaseModel):
    attendance_percentage: float = Field(..., ge=0.0, le=100.0, description="Attendance rate (0-100)")
    iat1_score: float = Field(..., ge=0.0, le=100.0, description="IAT 1 Marks (0-100)")
    iat2_score: float = Field(..., ge=0.0, le=100.0, description="IAT 2 Marks (0-100)")
    assignment_avg: Optional[float] = Field(70.0, ge=0.0, le=100.0)
    lab_performance: Optional[float] = Field(70.0, ge=0.0, le=100.0)
    behavior_score: Optional[float] = Field(85.0, ge=0.0, le=100.0)
    past_gpa: Optional[float] = Field(7.0, ge=0.0, le=10.0)

class WhatIfSimulationPayload(BaseModel):
    baseline: StudentFeaturesPayload
    adjustments: Dict[str, float]

@router.post("/predict-risk")
def predict_student_risk(payload: StudentFeaturesPayload):
    """
    Random Forest Risk Classifier with Dynamic XAI (Tree Feature Attribution & Benchmark Deviation).
    """
    try:
        return ml_engine.predict_risk(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-cgpa")
def predict_projected_cgpa(payload: StudentFeaturesPayload):
    """
    Ridge Regression Continuous Predictor for Projected End-of-Semester CGPA.
    """
    try:
        return ml_engine.predict_projected_cgpa(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/what-if-simulate")
def simulate_what_if_scenario(payload: WhatIfSimulationPayload):
    """
    Interactive What-If Simulation Sandbox: Compares baseline student twin vs hypothetical intervention.
    """
    try:
        return ml_engine.simulate_what_if(
            baseline=payload.baseline.model_dump(),
            adjustments=payload.adjustments
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-metrics")
def get_model_benchmarks():
    """
    Returns comparative evaluation metrics (R2, MAE, Accuracy, Confusion Matrix, Feature Importances)
    for Ridge Regression and Random Forest.
    """
    metrics = ml_engine.get_benchmarks()
    if not metrics:
        raise HTTPException(status_code=404, detail="Model benchmark metrics not available.")
    return metrics
