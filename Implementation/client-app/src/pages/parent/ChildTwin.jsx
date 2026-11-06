import { useSim } from "../../simulations/SimulationContext";
import { TrendingUp, CheckCircle2, AlertTriangle, BookOpen, Heart, Activity } from "lucide-react";
import "./parentDashboard.css";

export default function ChildTwin() {
  const { activeParent: p } = useSim();
  const t = p.childTwin;

  const statusIcon = {
    Excellent:   <CheckCircle2 size={22} color="#10b981" />,
    Improving:   <TrendingUp size={22} color="#2563eb" />,
    Moderate:    <AlertTriangle size={22} color="#d97706" />,
    Critical:    <AlertTriangle size={22} color="#e11d48" />,
    "At Risk":   <AlertTriangle size={22} color="#e11d48" />,
  }[t.overallStatus] || <CheckCircle2 size={22} />;

  return (
    <div className="parent-page">
      <header className="parent-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
              ACADEMIC HEALTH CHECK
            </span>
          </div>
          <h1>{p.childName}'s Progress Overview</h1>
          <p>Holistic summary of academic performance, attendance regularity, and classroom engagement.</p>
        </div>
      </header>

      {/* Main Status Badge */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div style={{
          background: t.statusColor + "15",
          border: `1px solid ${t.statusColor}33`,
          color: t.statusColor,
          padding: "10px 20px",
          borderRadius: 24,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12
        }}>
          {statusIcon}
          <span style={{ fontSize: 20, fontWeight: 800 }}>Current Standing: {t.overallStatus}</span>
        </div>
        <p style={{ color: "#64748b", maxWidth: 520, lineHeight: 1.5, fontSize: 14 }}>
          Overall progress is categorized as <strong style={{ color: t.statusColor }}>{t.overallStatus.toLowerCase()}</strong> based on latest internal assessments and attendance verification.
        </p>
        <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Last verified by Faculty: {t.lastUpdated}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 12 }}>
        {/* Academic Marks Progress */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
            <BookOpen size={18} color="#2563eb" /> Academic Marks & Test Trend
          </h3>
          <div style={{ display: "flex", gap: 10, height: 110, alignItems: "flex-end", marginBottom: 16, background: "#f8fafc", padding: "12px", borderRadius: 10 }}>
            {t.academicBars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === t.academicBars.length - 1 ? "#2563eb" : "#cbd5e1",
                  borderRadius: 4,
                  transition: "height 0.3s ease",
                }}
              ></div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{t.academicNote}</p>
        </div>

        {/* Classroom Engagement & Consistency */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
            <Activity size={18} color="#10b981" /> Attendance & Classroom Engagement
          </h3>
          <div style={{ display: "flex", gap: 10, height: 110, alignItems: "flex-end", marginBottom: 16, background: "#f8fafc", padding: "12px", borderRadius: 10 }}>
            {t.emotionalBars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === t.emotionalBars.length - 1 ? "#10b981" : "#cbd5e1",
                  borderRadius: 4,
                  transition: "height 0.3s ease",
                }}
              ></div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{t.emotionalNote}</p>
        </div>
      </div>
    </div>
  );
}
