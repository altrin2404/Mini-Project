import { useState, useEffect } from "react";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { mlApi } from "../../../api/mlApi";

export default function XaiWaterfall({ student }) {
  const [xaiData, setXaiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;

    const payload = {
      attendance_percentage: student.dashboard?.attendance || 75.0,
      iat1_score: student.dashboard?.academic || 70.0,
      iat2_score: student.dashboard?.academic || 70.0,
      assignment_avg: 75.0,
      lab_performance: 75.0,
      behavior_score: student.dashboard?.behavior || 85.0,
      past_gpa: student.dashboard?.cgpa || 7.2,
    };

    setLoading(true);
    mlApi
      .predictRisk(payload)
      .then((data) => {
        setXaiData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("XAI Prediction Error:", err);
        setLoading(false);
      });
  }, [student]);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#64748b", background: "#f8fafc", borderRadius: 12 }}>
        Calculating Random Forest Tree Attribution & Explainability factors...
      </div>
    );
  }

  if (!xaiData) return null;

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
            <Brain size={20} color="#6366f1" />
            Why This Risk Rating? (Key Influencing Factors)
          </h4>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            See exactly which areas (attendance, exam marks, or lab work) are helping you stay safe or pulling you into risk.
          </p>
        </div>
        <div
          style={{
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 700,
            background:
              xaiData.predicted_risk_level === "High"
                ? "#fef2f2"
                : xaiData.predicted_risk_level === "Medium"
                ? "#fffbeb"
                : "#f0fdf4",
            color:
              xaiData.predicted_risk_level === "High"
                ? "#dc2626"
                : xaiData.predicted_risk_level === "Medium"
                ? "#d97706"
                : "#16a34a",
            border: "1px solid currentColor",
          }}
        >
          {xaiData.predicted_risk_level} Risk ({xaiData.confidence}% Confidence)
        </div>
      </div>

      {/* Feature attribution waterfall bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {xaiData.explainable_factors?.map((f) => {
          const isNegative = f.difference < 0;
          const barWidth = Math.min(Math.abs(f.difference) * 2.5, 100);

          return (
            <div
              key={f.feature}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: f.status === "critical" ? "#fff1f2" : f.status === "warning" ? "#fffbeb" : "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ flex: "0 0 200px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{f.label}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  Current: <b>{f.student_value}</b> | Benchmark: {f.benchmark}
                </div>
              </div>

              {/* Bar visualization */}
              <div style={{ flex: "1 1 auto", margin: "0 20px", display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", background: "#e2e8f0", height: 8, borderRadius: 4, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: isNegative ? `${50 - barWidth / 2}%` : "50%",
                      width: `${barWidth / 2}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: isNegative ? (f.status === "critical" ? "#ef4444" : "#f59e0b") : "#10b981",
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: "0 0 110px", textAlign: "right" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isNegative ? (f.status === "critical" ? "#ef4444" : "#d97706") : "#10b981",
                  }}
                >
                  {isNegative ? `${f.difference}` : `+${f.difference}`} delta
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
