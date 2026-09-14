import { useSim } from "../../simulations/SimulationContext";
import { Bell, History, AlertCircle, AlertTriangle, Info, GraduationCap, X, CheckCircle, Sparkles, Brain } from "lucide-react";
import { useState } from "react";
import "./parentDashboard.css";

export default function ParentDashboard() {
  const { activeParent: p } = useSim();
  const d = p.dashboard;
  const t = p.childTwin;

  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState({});
  const [successModal, setSuccessModal] = useState(false);

  const handleAcknowledge = (id) => {
    setAcknowledgedAlerts(prev => ({ ...prev, [id]: true }));
    setSuccessModal(true);
  };

  const activeAlerts = d.systemAlerts.filter(alert => !acknowledgedAlerts[alert.id]);

  return (
    <div className="parent-page">
      <header className="parent-header">
        <div>
          <h1>Your Action Required</h1>
          <p>Critical information and diagnostics for <strong>{p.childName}</strong>.</p>
        </div>
        <button className="alert-history-btn" onClick={() => alert("Loading historical parent alert logs...")}>
          <History size={18} /> Alert History
        </button>
      </header>

      {/* Twin Stability Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${d.twinStatusColor}18, ${d.twinStatusColor}08)`,
        border: `1.5px solid ${d.twinStatusColor}44`,
        borderRadius: 20,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: d.twinStatusColor, minWidth: 80 }}>
          {d.twinStability}
        </div>
        <div>
          <p style={{ fontWeight: 700, color: d.twinStatusColor, fontSize: 16, marginBottom: 4 }}>
            Twin Stability — {d.twinStatus}
          </p>
          <p style={{ color: "#64748b", fontSize: 14 }}>{d.updateMsg}</p>
        </div>
      </div>

      {/* Split Dashboard Content Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, flex: 1, overflow: "hidden" }}>
        
        {/* Left Column: Alerts Scroll Zone */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            🚨 Active Intervention Flags ({activeAlerts.length})
          </h3>
          <div className="alerts-container">
            {activeAlerts.length === 0 ? (
              <div className="parent-card" style={{ background: "linear-gradient(135deg, #10b981, #34d399)", color: "white", border: "none", padding: "32px", height: "100%", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <div className="card-icon-box" style={{ background: "rgba(255,255,255,0.2)", marginBottom: 12 }}>✅</div>
                <h2 style={{ color: "white", fontSize: 20 }}>All Indicators Normal</h2>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>No warning flags have been raised. {p.childName}'s academic twin is fully stable.</p>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div key={alert.id} className={`parent-card ${alert.type.toLowerCase() === "critical" ? "critical" : "warning"}`}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="card-icon-box">
                      {alert.type.toLowerCase() === "critical" ? <AlertCircle size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <h2>{alert.type} Risk Alert: {alert.title}</h2>
                  </div>
                  <p>{alert.message}</p>
                  <button className="btn-action" onClick={() => handleAcknowledge(alert.id)}>
                    Acknowledge Alert
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Predictive Diagnostics & AI Recommendations */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
          
          {/* AI Recommendation Card */}
          <div className="update-item" style={{ flex: 1.2, display: "flex", flexDirection: "column", justifyBox: "space-between" }}>
            <header>
              <Brain size={18} />
              <span>Predictive Diagnostics</span>
            </header>
            <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, borderLeft: "4px solid var(--primary)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, margin: "8px 0" }}>
              <strong>Observation:</strong>
              <p style={{ marginTop: 4 }}>{t.academicNote}</p>
            </div>
            <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, borderLeft: "4px solid #8b5cf6", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong>Emotional Well-being:</strong>
              <p style={{ marginTop: 4 }}>{t.emotionalNote}</p>
            </div>
          </div>

          {/* Quick Metrics Widget */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, flex: 0.8, justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 700 }}>ACADEMIC PROGRESS:</span>
              <strong style={{ fontSize: 14, color: t.statusColor }}>{t.overallStatus}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 700 }}>LAST RE-EVALUATION:</span>
              <strong style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.lastUpdated}</strong>
            </div>
          </div>

        </div>

      </div>

      {/* Acknowledgment Modal */}
      {successModal && (
        <div className="modal-overlay" onClick={() => setSuccessModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSuccessModal(false)}><X size={16} /></button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 0" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyBox: "center", justifyContent: "center", marginBottom: 20 }}>
                <CheckCircle size={36} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Alert Acknowledged</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8, maxWidth: 400, lineHeight: 1.6 }}>
                You have successfully acknowledged this warning. The school administration and coordinator have been notified of your acknowledgment.
              </p>
              <button className="btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => setSuccessModal(false)}>
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: 8, textAlign: "center", fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
        Protected by Digital Twin Security Systems © 2024
      </footer>
    </div>
  );
}
