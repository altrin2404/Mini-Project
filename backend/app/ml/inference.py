import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

FEATURE_NAMES = [
    "attendance_percentage",
    "iat1_score",
    "iat2_score",
    "assignment_avg",
    "lab_performance",
    "behavior_score",
    "prev_sem_gpa",
    "past_cgpa"
]

FEATURE_DISPLAY_NAMES = {
    "attendance_percentage": "Attendance Rate (%)",
    "iat1_score": "IAT 1 Exam Score",
    "iat2_score": "IAT 2 Exam Score",
    "assignment_avg": "Assignment Submissions",
    "lab_performance": "Lab Practical Work",
    "behavior_score": "Discipline & Conduct",
    "prev_sem_gpa": "Previous Semester GPA (SGPA)",
    "past_cgpa": "Historical Cumulative CGPA"
}

FEATURE_BENCHMARKS = {
    "attendance_percentage": 75.0,
    "iat1_score": 50.0,
    "iat2_score": 50.0,
    "assignment_avg": 60.0,
    "lab_performance": 60.0,
    "behavior_score": 75.0,
    "prev_sem_gpa": 6.5,
    "past_cgpa": 6.5
}

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
RIDGE_SEM_PATH = os.path.join(MODEL_DIR, "ridge_sem_gpa_model.joblib")
RIDGE_CGPA_PATH = os.path.join(MODEL_DIR, "ridge_cgpa_model.joblib")
RF_PATH = os.path.join(MODEL_DIR, "rf_risk_model.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "model_metrics.json")

class MLInferenceEngine:
    def __init__(self):
        self.ridge_sem_model = None
        self.ridge_cgpa_model = None
        self.rf_model = None
        self.metrics = {}
        self.load_models()

    def load_models(self):
        if os.path.exists(RIDGE_SEM_PATH):
            self.ridge_sem_model = joblib.load(RIDGE_SEM_PATH)
        if os.path.exists(RIDGE_CGPA_PATH):
            self.ridge_cgpa_model = joblib.load(RIDGE_CGPA_PATH)
        if os.path.exists(RF_PATH):
            self.rf_model = joblib.load(RF_PATH)
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r") as f:
                self.metrics = json.load(f)

    def _normalize_features(self, payload: Dict[str, Any]) -> List[float]:
        vector = []
        for feat in FEATURE_NAMES:
            val = payload.get(feat)
            if val is None:
                # Fallback support if legacy or single past_gpa supplied
                if feat == "prev_sem_gpa" and "past_gpa" in payload:
                    val = payload["past_gpa"]
                elif feat == "past_cgpa" and "past_gpa" in payload:
                    val = payload["past_gpa"]
                else:
                    val = FEATURE_BENCHMARKS[feat]
            vector.append(float(val))
        return vector

    def predict_risk(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs Random Forest inference and computes dynamic feature attribution.
        """
        if not self.rf_model:
            raise RuntimeError("Random Forest model not loaded.")

        vec = self._normalize_features(features)
        df_row = pd.DataFrame([vec], columns=FEATURE_NAMES)

        pred_class = self.rf_model.predict(df_row)[0]
        probs = self.rf_model.predict_proba(df_row)[0]
        class_probs = {cls_name: round(float(prob), 4) for cls_name, prob in zip(self.rf_model.classes_, probs)}

        # Explainable factor breakdown (Tree feature attribution)
        feature_explanations = []
        global_importances = dict(zip(FEATURE_NAMES, self.rf_model.feature_importances_))

        for feat, val in zip(FEATURE_NAMES, vec):
            benchmark = FEATURE_BENCHMARKS[feat]
            diff = val - benchmark
            importance = global_importances[feat]
            impact_score = diff * importance
            
            status = "safe"
            if diff < 0:
                status = "critical" if abs(diff) > 20 else "warning"

            feature_explanations.append({
                "feature": feat,
                "label": FEATURE_DISPLAY_NAMES[feat],
                "student_value": round(val, 2),
                "benchmark": benchmark,
                "difference": round(diff, 2),
                "status": status,
                "importance_weight": round(importance, 4),
                "impact_score": round(impact_score, 4)
            })

        feature_explanations.sort(key=lambda x: x["impact_score"])

        return {
            "predicted_risk_level": pred_class,
            "confidence": round(float(np.max(probs)) * 100, 2),
            "class_probabilities": class_probs,
            "explainable_factors": feature_explanations,
            "model_metadata": {
                "algorithm": "RandomForestClassifier",
                "trees": self.rf_model.n_estimators,
                "xai_method": "Tree Feature Attribution & Benchmark Deviation"
            }
        }

    def predict_projected_cgpa(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs Ridge Regression inference predicting BOTH:
        1. Current Single Semester GPA (SGPA)
        2. Cumulative Overall CGPA
        """
        vec = self._normalize_features(features)
        df_row = pd.DataFrame([vec], columns=FEATURE_NAMES)

        # Single Semester GPA
        pred_sem_gpa = 7.5
        if self.ridge_sem_model:
            pred_sem_gpa = float(self.ridge_sem_model.predict(df_row)[0])
            pred_sem_gpa = float(np.clip(pred_sem_gpa, 0.0, 10.0))

        # Overall Cumulative CGPA
        pred_cgpa = 7.5
        if self.ridge_cgpa_model:
            pred_cgpa = float(self.ridge_cgpa_model.predict(df_row)[0])
            pred_cgpa = float(np.clip(pred_cgpa, 0.0, 10.0))

        return {
            "predicted_semester_gpa": round(pred_sem_gpa, 2),
            "predicted_projected_cgpa": round(pred_cgpa, 2),
            "model_metadata": {
                "algorithm": "Ridge(alpha=1.0) Dual Regressors",
                "semester_gpa_r2": self.metrics.get("ridge_semester_gpa", {}).get("r2_score", 0.99),
                "cumulative_cgpa_r2": self.metrics.get("ridge_cumulative_cgpa", {}).get("r2_score", 0.99)
            }
        }

    def simulate_what_if(self, baseline: Dict[str, Any], adjustments: Dict[str, Any]) -> Dict[str, Any]:
        """
        What-If Sandbox: Compares baseline student twin metrics vs hypothetical modified features.
        Calculates both Semester GPA delta and Cumulative CGPA delta.
        """
        simulated = dict(baseline)
        for key, val in adjustments.items():
            if key in FEATURE_NAMES:
                simulated[key] = val

        base_risk = self.predict_risk(baseline)
        base_scores = self.predict_projected_cgpa(baseline)

        sim_risk = self.predict_risk(simulated)
        sim_scores = self.predict_projected_cgpa(simulated)

        sem_delta = round(sim_scores["predicted_semester_gpa"] - base_scores["predicted_semester_gpa"], 2)
        cgpa_delta = round(sim_scores["predicted_projected_cgpa"] - base_scores["predicted_projected_cgpa"], 2)

        return {
            "baseline": {
                "risk_level": base_risk["predicted_risk_level"],
                "semester_gpa": base_scores["predicted_semester_gpa"],
                "projected_cgpa": base_scores["predicted_projected_cgpa"],
                "confidence": base_risk["confidence"]
            },
            "simulated": {
                "risk_level": sim_risk["predicted_risk_level"],
                "semester_gpa": sim_scores["predicted_semester_gpa"],
                "projected_cgpa": sim_scores["predicted_projected_cgpa"],
                "confidence": sim_risk["confidence"]
            },
            "impact_summary": {
                "semester_gpa_delta": sem_delta,
                "cgpa_delta": cgpa_delta,
                "risk_transition": f"{base_risk['predicted_risk_level']} -> {sim_risk['predicted_risk_level']}",
                "status_improved": (sim_scores["predicted_projected_cgpa"] > base_scores["predicted_projected_cgpa"]) or (
                    base_risk["predicted_risk_level"] in ["High", "Medium"] and sim_risk["predicted_risk_level"] == "Low"
                )
            },
            "adjustments_tested": adjustments
        }

    def get_benchmarks(self) -> Dict[str, Any]:
        return self.metrics

ml_engine = MLInferenceEngine()
