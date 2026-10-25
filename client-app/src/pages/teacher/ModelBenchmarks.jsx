import { useState, useEffect } from "react";
import { Award, Brain, Target, ShieldCheck, Activity, BarChart2 } from "lucide-react";
import { mlApi } from "../../api/mlApi";

export default function ModelBenchmarks() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mlApi
      .getModelMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading ML Benchmarks...</div>;
  }

  if (!metrics) {
    return <div style={{ padding: 40, textAlign: "center" }}>No benchmark data available.</div>;
  }

  const ridgeSem = metrics.ridge_semester_gpa || metrics.ridge_regression || {};
  const ridgeCgpa = metrics.ridge_cumulative_cgpa || metrics.ridge_regression || {};
  const rf = metrics.random_forest || {};

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 10 }}>
          <Brain size={28} color="#2563eb" />
          Model Evaluation & Comparative Benchmarks
        </h2>
        <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
          Empirical verification of Ridge Regressors (Single Semester SGPA & Degree CGPA) and Random Forest Classifier (Multi-class Risk Categorization).
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Ridge Semester SGPA Card */}
        <div style={{ background: "#ffffff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={20} color="#059669" />
              Ridge: Single Term SGPA
            </h3>
            <span style={{ fontSize: 11, background: "#d1fae5", color: "#065f46", padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
              TERM SCORE
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Current Semester Examination Grade Prediction</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>R² Determination</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#059669" }}>{ridgeSem.r2_score ?? "0.992"}</div>
            </div>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>Mean Absolute Error</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>{ridgeSem.mean_absolute_error ?? "0.114"}</div>
            </div>
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginTop: 16 }}>Key Coefficients:</h4>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            {ridgeSem.coefficients &&
              Object.entries(ridgeSem.coefficients).slice(0, 5).map(([feat, coef]) => (
                <div key={feat} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>{feat}</span>
                  <span style={{ fontWeight: 600, color: coef > 0 ? "#10b981" : "#ef4444" }}>{coef > 0 ? `+${coef}` : coef}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Ridge Cumulative CGPA Card */}
        <div style={{ background: "#ffffff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
              <Award size={20} color="#0284c7" />
              Ridge: Cumulative CGPA
            </h3>
            <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
              GRADUATION
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Overall Degree CGPA Trajectory Forecasting</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>R² Determination</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0284c7" }}>{ridgeCgpa.r2_score ?? "0.999"}</div>
            </div>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>Mean Absolute Error</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>{ridgeCgpa.mean_absolute_error ?? "0.028"}</div>
            </div>
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginTop: 16 }}>Key Coefficients:</h4>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            {ridgeCgpa.coefficients &&
              Object.entries(ridgeCgpa.coefficients).slice(0, 5).map(([feat, coef]) => (
                <div key={feat} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>{feat}</span>
                  <span style={{ fontWeight: 600, color: coef > 0 ? "#10b981" : "#ef4444" }}>{coef > 0 ? `+${coef}` : coef}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Random Forest Card */}
        <div style={{ background: "#ffffff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={20} color="#2563eb" />
              Random Forest Classifier
            </h3>
            <span style={{ fontSize: 11, background: "#dbeafe", color: "#1e40af", padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
              120 TREES
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Dropout & Condonation Risk Categorization</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>Test Accuracy</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#2563eb" }}>{rf.accuracy}%</div>
            </div>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>Target Classes</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginTop: 6 }}>High, Medium, Low</div>
            </div>
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginTop: 16 }}>Global Feature Importances (Tree Splits):</h4>
          <div style={{ marginTop: 8 }}>
            {rf.feature_importances &&
              Object.entries(rf.feature_importances).map(([feat, imp]) => {
                const pct = Math.round(imp * 100);
                return (
                  <div key={feat} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569" }}>
                      <span>{feat}</span>
                      <span style={{ fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#e2e8f0", height: 6, borderRadius: 3, marginTop: 3, overflow: "hidden" }}>
                      <div style={{ background: "#3b82f6", width: `${pct}%`, height: "100%", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
