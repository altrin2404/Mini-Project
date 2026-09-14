import { Line } from "react-chartjs-2";
import { useSim } from "../../../simulations/SimulationContext";
import { Activity, PieChart, GraduationCap, Clock } from "lucide-react";
import "./riskInsights.css";

export default function RiskInsights() {
  const { activeStudent: s } = useSim();
  const r = s.risk;

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Risk Score",
        data: r.trend,
        borderColor: r.riskColor,
        backgroundColor: r.riskColor + "22",
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: r.riskColor,
        pointBorderWidth: 2,
      },
    ],
  };

  const total = r.academic + r.attendance + r.behavior;

  return (
    <div className="risk-page">
      <div className="risk-header">
        <div>
          <h1>Risk Insights</h1>
          <p>
            Detailed ML-computed risk analysis for <strong>{s.name}</strong>.
          </p>
          <span className="status-pill" style={{ background: r.riskColor + "22", color: r.riskColor }}>
            {r.riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="risk-grid">
        {/* Risk Trend */}
        <div className="risk-card">
          <div className="risk-card-header">
            <h3><div className="icon-box"><Activity size={20} /></div> Risk Trend</h3>
            <button className="btn-score" style={{ background: r.riskColor + "22", color: r.riskColor }}>
              {r.riskLevel} Risk
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Last 4 Months</p>
          <div className="chart-container">
            <Line
              data={trendData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 0, max: 100, border: { display: false }, grid: { color: "#f1f5f9" } },
                  x: { border: { display: false }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="risk-card">
          <div className="risk-card-header">
            <h3><div className="icon-box"><PieChart size={20} /></div> Risk Breakdown</h3>
            <a href="#" style={{ color: "#7c3aed", fontSize: 14, fontWeight: 600 }}>View Details</a>
          </div>

          <div className="breakdown-list">
            {/* Academic */}
            <div className="breakdown-item">
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "#dbeafe", color: "#3b82f6", padding: 6, borderRadius: 8 }}><GraduationCap size={16} /></div>
                    Academic
                  </div>
                  <span className="sub">Category</span>
                </div>
                <span className="breakdown-percent">{r.academic}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${r.academic}%`, background: "#3b82f6" }}></div>
              </div>
            </div>

            {/* Attendance */}
            <div className="breakdown-item">
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "#dcfce7", color: "#10b981", padding: 6, borderRadius: 8 }}><Clock size={16} /></div>
                    Attendance
                  </div>
                  <span className="sub">Category</span>
                </div>
                <span className="breakdown-percent" style={{ color: "#10b981" }}>{r.attendance}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${r.attendance}%`, background: "#10b981" }}></div>
              </div>
            </div>

            {/* Behavior */}
            <div className="breakdown-item">
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "#fef3c7", color: "#f59e0b", padding: 6, borderRadius: 8 }}>⚡</div>
                    Behavior
                  </div>
                  <span className="sub">Category</span>
                </div>
                <span className="breakdown-percent" style={{ color: "#f59e0b" }}>{r.behavior}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${r.behavior}%`, background: "#f59e0b" }}></div>
              </div>
            </div>
          </div>

          {/* Composite */}
          <div style={{ marginTop: 24, padding: "16px 20px", background: "#f8fafc", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Composite Risk Score</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: r.riskColor }}>
              {Math.round((r.academic + r.attendance + r.behavior) / 3)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
