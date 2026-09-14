import { useSim } from "../../simulations/SimulationContext";
import { TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import "./parentDashboard.css";

export default function ChildTwin() {
  const { activeParent: p } = useSim();
  const t = p.childTwin;

  const statusIcon = {
    Excellent:   <CheckCircle2 size={24} />,
    Improving:   <TrendingUp size={24} />,
    Moderate:    <AlertTriangle size={24} />,
    Critical:    <AlertTriangle size={24} />,
    "At Risk":   <AlertTriangle size={24} />,
  }[t.overallStatus] || <CheckCircle2 size={24} />;

  return (
    <div className="parent-page">
      <header className="parent-header">
        <h1>{p.childName}'s Digital Twin</h1>
        <p>At-a-glance state and trend comparisons for your child.</p>
      </header>

      <div className="admin-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: 48 }}>
        <TrendingUp size={48} color={t.statusColor} style={{ marginBottom: 24 }} />
        <div style={{ background: t.statusColor + "22", color: t.statusColor, padding: "12px 24px", borderRadius: 32, display: "flex", alignItems: "center", gap: 12 }}>
          {statusIcon}
          <span style={{ fontSize: 24, fontWeight: 800 }}>{t.overallStatus}</span>
        </div>
        <p style={{ marginTop: 24, color: "#64748b", maxWidth: 500, lineHeight: 1.6 }}>
          Overall well-being is <strong style={{ color: t.statusColor }}>{t.overallStatus.toLowerCase()}</strong>. Review the detailed indicators below.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 16, fontSize: 13, color: "#94a3b8" }}>
          <span>Last Updated: {t.lastUpdated}</span>
          <span style={{ color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>View Snapshots</span>
        </div>
      </div>

      <div className="admin-grid" style={{ marginTop: 32 }}>
        {/* Academic Well-being */}
        <div className="admin-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            📚 Academic Well-being
          </h3>
          <div style={{ display: "flex", gap: 12, height: 120, alignItems: "flex-end", marginBottom: 20 }}>
            {t.academicBars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === t.academicBars.length - 1 ? t.statusColor : "#c7d2fe",
                  borderRadius: 4,
                  transition: "height 0.5s ease",
                }}
              ></div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "#64748b" }}>{t.academicNote}</p>
        </div>

        {/* Emotional Well-being */}
        <div className="admin-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            💜 Emotional Well-being
          </h3>
          <div style={{ display: "flex", gap: 12, height: 120, alignItems: "flex-end", marginBottom: 20 }}>
            {t.emotionalBars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === t.emotionalBars.length - 1 ? t.statusColor + "aa" : "#e9d5ff",
                  borderRadius: 4,
                  transition: "height 0.5s ease",
                }}
              ></div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "#64748b" }}>{t.emotionalNote}</p>
        </div>
      </div>
    </div>
  );
}
