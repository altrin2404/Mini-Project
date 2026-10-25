import { useSim } from "../../simulations/SimulationContext";
import {
  Bell,
  History,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  X,
  CheckCircle,
  TrendingUp,
  FileText,
  Calendar,
  HeartHandshake
} from "lucide-react";
import { useState } from "react";
import "./parentDashboard.css";

export default function ParentDashboard() {
  const { activeParent: p } = useSim();
  const d = p.dashboard;
  const t = p.childTwin;

  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState({});
  const [successModal, setSuccessModal] = useState(false);

  const handleAcknowledge = (id) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: true }));
    setSuccessModal(true);
  };

  const activeAlerts = d.systemAlerts.filter((alert) => !acknowledgedAlerts[alert.id]);

  return (
    <div className="parent-page">
      {/* Header */}
      <header className="parent-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
              PARENT PORTAL
            </span>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Student: {p.childName}</span>
          </div>
          <h1>Parent & Guardian Overview</h1>
          <p>
            Stay updated with <strong>{p.childName}</strong>'s current semester progress, attendance, and official notices from mentors.
          </p>
        </div>
      </header>

      {/* Academic Standing Status Card */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: d.twinStatusColor === "#10b981" ? "#ecfdf5" : "#fff1f2",
            border: `1px solid ${d.twinStatusColor}33`,
            color: d.twinStatusColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 20
          }}>
            {d.twinStatusColor === "#10b981" ? "✅" : "⚠️"}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Academic Standing: <span style={{ color: d.twinStatusColor }}>{d.twinStatus}</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{d.updateMsg}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Progress Consistency</span>
            <strong style={{ display: "block", fontSize: 20, color: d.twinStatusColor }}>{d.twinStability}</strong>
          </div>
        </div>
      </div>

      {/* Split Dashboard Content Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Alerts & Mentor Notices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <Bell size={18} color="#e11d48" />
            Mentor Notices & Early Alerts ({activeAlerts.length})
          </h2>

          <div className="alerts-container">
            {activeAlerts.length === 0 ? (
              <div style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                borderRadius: 12,
                padding: "36px 24px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#166534" }}>No Urgent Notices</h3>
                <p style={{ fontSize: 13, color: "#15803d", marginTop: 4 }}>
                  All attendance and internal exam records for {p.childName} are in safe standing.
                </p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    background: alert.type.toLowerCase() === "critical" ? "#fff1f2" : "#fffbeb",
                    border: `1px solid ${alert.type.toLowerCase() === "critical" ? "#fecdd3" : "#fef3c7"}`,
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {alert.type.toLowerCase() === "critical" ? (
                        <AlertCircle size={18} color="#e11d48" />
                      ) : (
                        <AlertTriangle size={18} color="#d97706" />
                      )}
                      <strong style={{ fontSize: 14, color: alert.type.toLowerCase() === "critical" ? "#9f1239" : "#92400e" }}>
                        {alert.type} Notice: {alert.title}
                      </strong>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: 0 }}>{alert.message}</p>
                  
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: alert.type.toLowerCase() === "critical" ? "#e11d48" : "#d97706",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Acknowledge Notice Received
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Teacher Recommendations & Growth Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <HeartHandshake size={18} color="#2563eb" />
              Academic Mentor Feedback
            </h3>

            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, borderLeft: "4px solid #2563eb", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase" }}>Exam & Subject Progress</span>
              <p style={{ fontSize: 13, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>{t.academicNote}</p>
            </div>

            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, borderLeft: "4px solid #10b981" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>Classroom Engagement & Conduct</span>
              <p style={{ fontSize: 13, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>{t.emotionalNote}</p>
            </div>
          </div>

          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 18,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Overall Term Standing:</span>
              <strong style={{ fontSize: 13, color: t.statusColor }}>{t.overallStatus}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Last Updated by Faculty:</span>
              <strong style={{ fontSize: 12, color: "#334155" }}>{t.lastUpdated}</strong>
            </div>
          </div>

        </div>

      </div>

      {/* Acknowledgment Modal */}
      {successModal && (
        <div className="modal-overlay" onClick={() => setSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSuccessModal(false)}><X size={16} /></button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 0" }}>
              <div style={{ background: "#ecfdf5", color: "#10b981", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <CheckCircle size={32} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Notice Acknowledged</h2>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 8, maxWidth: 380, lineHeight: 1.5 }}>
                Your acknowledgment has been recorded and the department faculty has been notified.
              </p>
              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 20, background: "#1e3a8a", padding: "10px", borderRadius: 8, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}
                onClick={() => setSuccessModal(false)}
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
