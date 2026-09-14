import { Line } from "react-chartjs-2";
import { useSim } from "../../../simulations/SimulationContext";
import { ClipboardCheck, GraduationCap, Zap, Lightbulb, AlertTriangle, RefreshCw, X, FileText, Sparkles, Calendar } from "lucide-react";
import { useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const { activeStudent: s } = useSim();
  const d = s.dashboard;

  // Modal states
  const [reportModal, setReportModal] = useState(false);
  const [insightModal, setInsightModal] = useState(false);
  const [tutorModal, setTutorModal] = useState(false);

  const performanceTrend = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance",
        data: d.trendAttendance,
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Academic",
        data: d.trendAcademic,
        borderColor: "#6C63FF",
        backgroundColor: "rgba(108, 99, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Behavior",
        data: d.trendBehavior,
        borderColor: "#FB923C",
        backgroundColor: "rgba(251, 146, 60, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const badgeClass = {
    success: "badge success",
    info: "badge info",
    warning: "badge warning",
    danger: "badge danger",
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Timeline Overview ✨</h1>
          <p>Track <strong>{s.name}</strong>'s academic journey and performance trends.</p>
          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <span className="status-pill">System Online</span>
            <button className="btn-icon" style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "50%", padding: 6, display: "flex" }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <section className="timeline-grid animate-fade-in-up">
        <div className="timeline-card">
          <div className="icon-box"><ClipboardCheck size={20} /></div>
          <span className={badgeClass[d.attendanceBadge]}>{d.attendanceDelta}</span>
          <h3>Attendance Rate</h3>
          <div className="value">{d.attendance}%</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${d.attendance}%`, background: "#34D399" }}></div>
          </div>
        </div>

        <div className="timeline-card">
          <div className="icon-box"><GraduationCap size={20} /></div>
          <span className={badgeClass[d.academicBadge]}>{d.academicLabel}</span>
          <h3>Academic Score</h3>
          <div className="value">{d.academic}/100</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${d.academic}%`, background: "#6C63FF" }}></div>
          </div>
        </div>

        <div className="timeline-card">
          <div className="icon-box"><Zap size={20} /></div>
          <span className={badgeClass[d.behaviorBadge]}>{d.behaviorLabel}</span>
          <h3>Behavior Index</h3>
          <div className="value">{d.behavior}/100</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${d.behavior}%`, background: "#FB923C" }}></div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE TRENDS */}
      <section className="trend-section animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="section-title">
          <div>
            <h2>Performance Trends</h2>
            <p>Weekly breakdown of student metrics</p>
          </div>
          <div className="chart-legend">
            <div className="legend-item"><span className="dot" style={{ background: "#34D399" }}></span> Attendance</div>
            <div className="legend-item"><span className="dot" style={{ background: "#6C63FF" }}></span> Academic</div>
            <div className="legend-item"><span className="dot" style={{ background: "#FB923C" }}></span> Behavior</div>
          </div>
        </div>
        <div className="chart-container">
          <Line
            data={performanceTrend}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { min: 30, max: 100, border: { display: false }, grid: { color: "#f1f5f9" } },
                x: { border: { display: false }, grid: { display: false } },
              },
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => setReportModal(true)}
            style={{ color: "#6C63FF", background: "none", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            View Full Report →
          </button>
        </div>
      </section>

      {/* ACTION CARDS */}
      <section className="action-grid animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="insight-card">
          <div className="icon-box" style={{ background: "rgba(255,255,255,0.2)", marginBottom: 16, width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lightbulb size={20} />
          </div>
          <h3>AI Insight</h3>
          <p>{d.insight}</p>
          <button className="btn-white" onClick={() => setInsightModal(true)}>Details</button>
        </div>

        {d.attentionSubject ? (
          <div className="attention-card">
            <div className="attention-header">
              <div className="icon-warning"><AlertTriangle size={20} /></div>
              <div className="attention-content">
                <h3>Areas for Attention</h3>
                <p>{d.attentionMsg}</p>
              </div>
            </div>
            <div className="attention-footer">
              <span className="subject">{d.attentionSubject}</span>
              <span className="status-tag">Needs Review</span>
            </div>
            <div className="progress-bar-bg" style={{ margin: "12px 0" }}>
              <div className="progress-bar-fill" style={{ width: `${d.academic}%`, background: "#EF4444" }}></div>
            </div>
            <button className="btn-outline" onClick={() => setTutorModal(true)}>Schedule Tutor</button>
          </div>
        ) : (
          <div className="attention-card" style={{ background: "linear-gradient(135deg, #10b981, #34d399)", color: "white", padding: "32px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: 12, borderRadius: "50%", fontSize: 20 }}>🎉</div>
              <div>
                <h3 style={{ color: "white", fontSize: 18, fontWeight: 800 }}>All Clear!</h3>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 }}>No warning flags raised. Keep up the high standard!</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODALS */}
      {/* ──────────────────────────────────────────────────────── */}

      {/* 1. Report Modal */}
      {reportModal && (
        <div className="modal-overlay" onClick={() => setReportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setReportModal(false)}><X size={16} /></button>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: 12, borderRadius: 12 }}>
                <FileText size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>Term Analysis Report</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Generated for {s.name}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, background: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid var(--border)", fontSize: 14, color: "var(--text-main)", lineHeight: 1.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Academic Standing:</strong>
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>{s.twin.grade} ({d.academicLabel})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Monthly Attendance Rate:</strong>
                <span style={{ fontWeight: 700, color: "#10b981" }}>{d.attendance}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Behavior & Collaboration Index:</strong>
                <span style={{ fontWeight: 700, color: "#f59e0b" }}>{d.behavior}/100</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Twin Prediction Summary:</strong>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
                  {s.twin.summary} Based on historical benchmarks, predictions suggest a high probability of term completion inside the target GPA bracket.
                </p>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => setReportModal(false)}>
              Download PDF Copy
            </button>
          </div>
        </div>
      )}

      {/* 2. AI Insight Details Modal */}
      {insightModal && (
        <div className="modal-overlay" onClick={() => setInsightModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInsightModal(false)}><X size={16} /></button>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", padding: 12, borderRadius: 12 }}>
                <Sparkles size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>Predictive Twin Insights</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Real-time ML Model Interpretations</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 14, color: "var(--text-muted)" }}>
              <p>The system constantly aggregates raw engagement triggers (attendance, test performance, and behavioral incidents) to project academic outcomes.</p>
              <div style={{ padding: 16, background: "rgba(139, 92, 246, 0.05)", borderRadius: 12, border: "1px solid rgba(139, 92, 246, 0.1)", color: "var(--text-main)" }}>
                <strong>Interpreted Logic:</strong>
                <p style={{ marginTop: 6, fontSize: 13 }}>"{d.insight}"</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-light)" }}>FAILURE PROBABILITY</span>
                  <p style={{ fontSize: 20, fontWeight: 900, color: s.risk.riskLevel === "High" ? "#ef4444" : "#10b981", marginTop: 4 }}>
                    {(s.risk.academic * 0.8).toFixed(0)}%
                  </p>
                </div>
                <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-light)" }}>MODEL CONFIDENCE</span>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "var(--primary)", marginTop: 4 }}>94%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Schedule Tutor Modal */}
      {tutorModal && (
        <div className="modal-overlay" onClick={() => setTutorModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTutorModal(false)}><X size={16} /></button>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: 12, borderRadius: 12 }}>
                <Calendar size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>Schedule Intervention</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Tutoring & Remedial Scheduling</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                Address the current warning flag in <strong>{d.attentionSubject}</strong> by booking an active virtual remediation session with an academic mentor.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)" }}>SELECT TIME SLOT:</label>
                <select style={{ width: "100%", padding: 12, borderRadius: 12, border: "1.5px solid var(--border)", outline: "none", fontSize: 14 }}>
                  <option>Tomorrow, 3:00 PM - 4:00 PM (Intervention Slot A)</option>
                  <option>Friday, 4:30 PM - 5:30 PM (Intervention Slot B)</option>
                  <option>Saturday, 10:00 AM - 11:00 AM (Weekend Remedial)</option>
                </select>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 8 }}
                onClick={() => {
                  alert("Successfully scheduled tutor intervention slot!");
                  setTutorModal(false);
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
