import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    mean_absolute_error,
    r2_score,
    accuracy_score,
    classification_report,
    confusion_matrix
)
import joblib

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

def generate_synthetic_data(n_samples=2500, random_seed=42):
    """
    Generates realistic autonomous engineering college academic data
    with explicit distinction between:
    1. Single Semester GPA (SGPA)
    2. Cumulative Multi-Semester CGPA
    """
    np.random.seed(random_seed)

    # Base student capability (latent potential: 30 to 98)
    capability = np.random.normal(loc=70, scale=14, size=n_samples)
    capability = np.clip(capability, 30, 98)

    # Attendance (%)
    attendance = capability * 0.7 + np.random.normal(loc=25, scale=8, size=n_samples)
    attendance = np.clip(attendance, 35, 100)

    # Internal Assessment Test 1 (0-100)
    iat1 = capability + np.random.normal(loc=0, scale=7, size=n_samples)
    iat1 = np.clip(iat1, 10, 100)

    # Internal Assessment Test 2 (0-100)
    momentum = np.random.normal(loc=2, scale=6, size=n_samples)
    iat2 = iat1 + momentum
    iat2 = np.clip(iat2, 10, 100)

    # Assignment Average (0-100)
    assignment = (attendance * 0.4 + capability * 0.6) + np.random.normal(0, 5, n_samples)
    assignment = np.clip(assignment, 20, 100)

    # Lab Practical Marks (0-100)
    lab = (attendance * 0.5 + capability * 0.5) + np.random.normal(0, 6, n_samples)
    lab = np.clip(lab, 20, 100)

    # Behavior Score (0-100)
    behavior = np.random.choice([95, 90, 85, 75, 60, 40], size=n_samples, p=[0.35, 0.35, 0.15, 0.08, 0.05, 0.02])

    # 1. Historical Cumulative CGPA (Across past completed semesters: 1 to 4)
    past_cgpa = (capability / 10.0) + np.random.normal(0, 0.35, n_samples)
    past_cgpa = np.clip(past_cgpa, 4.0, 9.9)

    # 2. Previous Single Semester GPA (Last semester's individual SGPA)
    prev_sem_gpa = past_cgpa + np.random.normal(0, 0.4, n_samples)
    prev_sem_gpa = np.clip(prev_sem_gpa, 3.8, 10.0)

    # TARGET 1: Current Single Semester GPA (SGPA - 0.0 to 10.0 scale)
    # Calculated purely from this semester's internal marks & assignments
    sem_academic_eval = (iat1 * 0.30 + iat2 * 0.40 + assignment * 0.10 + lab * 0.20) / 10.0
    att_penalty = np.where(attendance < 75.0, (75.0 - attendance) * 0.04, 0.0)
    current_sem_gpa = sem_academic_eval - att_penalty
    current_sem_gpa = np.clip(current_sem_gpa, 2.0, 10.0)

    # TARGET 2: Cumulative Graduation CGPA
    # Mathematical weighted average: 4 past semesters (4/5 weight) + current semester (1/5 weight)
    projected_cgpa = (0.75 * past_cgpa) + (0.25 * current_sem_gpa)
    projected_cgpa = np.clip(projected_cgpa, 2.5, 9.95)

    # TARGET 3: Dropout / Academic Risk Category (Low, Medium, High) for Random Forest
    risk_labels = []
    for att, sem_g, i2 in zip(attendance, current_sem_gpa, iat2):
        if att < 65.0 or sem_g < 5.0 or i2 < 45.0:
            risk_labels.append("High")
        elif att < 75.0 or sem_g < 6.5 or i2 < 55.0:
            risk_labels.append("Medium")
        else:
            risk_labels.append("Low")

    df = pd.DataFrame({
        "attendance_percentage": attendance.round(1),
        "iat1_score": iat1.round(1),
        "iat2_score": iat2.round(1),
        "assignment_avg": assignment.round(1),
        "lab_performance": lab.round(1),
        "behavior_score": behavior.round(1),
        "prev_sem_gpa": prev_sem_gpa.round(2),
        "past_cgpa": past_cgpa.round(2),
        "current_sem_gpa": current_sem_gpa.round(2),
        "projected_cgpa": projected_cgpa.round(2),
        "risk_level": risk_labels
    })

    return df

def train_and_save():
    os.makedirs(os.path.join(os.path.dirname(__file__), "models"), exist_ok=True)
    model_dir = os.path.join(os.path.dirname(__file__), "models")

    df = generate_synthetic_data(n_samples=2500)
    X = df[FEATURE_NAMES]
    y_sem_gpa = df["current_sem_gpa"]
    y_cgpa = df["projected_cgpa"]
    y_clf = df["risk_level"]

    # 80-20 Train-Test Split
    X_train, X_test, y_sem_train, y_sem_test, y_cgpa_train, y_cgpa_test, y_clf_train, y_clf_test = train_test_split(
        X, y_sem_gpa, y_cgpa, y_clf, test_size=0.2, random_state=42, stratify=y_clf
    )

    # 1. Ridge Model 1: Current Semester GPA Predictor (SGPA)
    ridge_sem_gpa = Ridge(alpha=1.0)
    ridge_sem_gpa.fit(X_train, y_sem_train)
    sem_gpa_pred = ridge_sem_gpa.predict(X_test)
    sem_mae = float(mean_absolute_error(y_sem_test, sem_gpa_pred))
    sem_r2 = float(r2_score(y_sem_test, sem_gpa_pred))
    print(f"=== Ridge Regression (Semester GPA / SGPA) ===")
    print(f"MAE: {sem_mae:.4f} | R2 Score: {sem_r2:.4f}")

    # 2. Ridge Model 2: Cumulative Overall CGPA Predictor
    ridge_cgpa = Ridge(alpha=1.0)
    ridge_cgpa.fit(X_train, y_cgpa_train)
    cgpa_pred = ridge_cgpa.predict(X_test)
    cgpa_mae = float(mean_absolute_error(y_cgpa_test, cgpa_pred))
    cgpa_r2 = float(r2_score(y_cgpa_test, cgpa_pred))
    print(f"=== Ridge Regression (Cumulative CGPA) ===")
    print(f"MAE: {cgpa_mae:.4f} | R2 Score: {cgpa_r2:.4f}")

    # 3. Random Forest Classifier: Risk Categorization
    rf = RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42, class_weight="balanced")
    rf.fit(X_train, y_clf_train)
    y_clf_pred = rf.predict(X_test)
    acc = float(accuracy_score(y_clf_test, y_clf_pred))
    print(f"=== Random Forest Classifier ===")
    print(f"Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_clf_test, y_clf_pred))

    # Feature Importance
    feature_importances = {
        name: float(imp) for name, imp in zip(FEATURE_NAMES, rf.feature_importances_)
    }
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))

    # Save Models
    ridge_sem_path = os.path.join(model_dir, "ridge_sem_gpa_model.joblib")
    ridge_cgpa_path = os.path.join(model_dir, "ridge_cgpa_model.joblib")
    rf_path = os.path.join(model_dir, "rf_risk_model.joblib")

    joblib.dump(ridge_sem_gpa, ridge_sem_path)
    joblib.dump(ridge_cgpa, ridge_cgpa_path)
    joblib.dump(rf, rf_path)

    # Save benchmark metrics and metadata
    metrics_path = os.path.join(model_dir, "model_metrics.json")
    metrics = {
        "features": FEATURE_NAMES,
        "ridge_semester_gpa": {
            "model_type": "Ridge(alpha=1.0) - Single Semester SGPA",
            "mean_absolute_error": round(sem_mae, 4),
            "r2_score": round(sem_r2, 4),
            "coefficients": {name: round(float(c), 4) for name, c in zip(FEATURE_NAMES, ridge_sem_gpa.coef_)}
        },
        "ridge_cumulative_cgpa": {
            "model_type": "Ridge(alpha=1.0) - Cumulative CGPA",
            "mean_absolute_error": round(cgpa_mae, 4),
            "r2_score": round(cgpa_r2, 4),
            "coefficients": {name: round(float(c), 4) for name, c in zip(FEATURE_NAMES, ridge_cgpa.coef_)}
        },
        "random_forest": {
            "model_type": "RandomForestClassifier(n_estimators=120)",
            "accuracy": round(acc * 100, 2),
            "classes": list(rf.classes_),
            "feature_importances": sorted_importances,
            "confusion_matrix": confusion_matrix(y_clf_test, y_clf_pred, labels=list(rf.classes_)).tolist()
        }
    }

    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Models and metrics saved successfully in {model_dir}")

if __name__ == "__main__":
    train_and_save()
