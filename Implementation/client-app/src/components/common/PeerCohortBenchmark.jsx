import { Users, TrendingUp, Award, BarChart2 } from "lucide-react";

export default function PeerCohortBenchmark({ student }) {
  if (!student) return null;

  const d = student.dashboard || {};
  const currentAttendance = d.attendance || 75;
  const currentAcademic = d.academic || 72;
  const currentCgpa = d.cgpa || 7.5;

  // Cohort baseline statistics (Department of IT - Year 3 Section A)
  const cohort = {
    avgAttendance: 82.4,
    avgAcademic: 74.8,
    avgCgpa: 7.62,
    totalStudents: 64,
  };

  const getPercentile = (val, mean, std) => {
    const z = (val - mean) / std;
    // Approximated percentile
    if (z >= 1.5) return "Top 7%";
    if (z >= 1.0) return "Top 15%";
    if (z >= 0.5) return "Top 30%";
    if (z >= 0.0) return "Top 50% (Average)";
    if (z >= -0.5) return "Bottom 40%";
    if (z >= -1.0) return "Bottom 25%";
    return "Bottom 10% (Alert)";
  };

  const attPercentile = getPercentile(currentAttendance, cohort.avgAttendance, 8.0);
  const acadPercentile = getPercentile(currentAcademic, cohort.avgAcademic, 10.0);
  const cgpaPercentile = getPercentile(currentCgpa, cohort.avgCgpa, 0.8);

  const getBadgeStyle = (percentile) => {
    if (percentile.startsWith("Top 7%") || percentile.startsWith("Top 15%")) {
      return { background: "#d1fae5", color: "#065f46" };
    }
    if (percentile.startsWith("Bottom 10%") || percentile.startsWith("Bottom 25%")) {
      return { background: "#fee2e2", color: "#991b1b" };
    }
    return { background: "#fef3c7", color: "#92400e" };
  };

  return (
    <div style={{ background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <Users size={18} color="#2563eb" />
            How You Compare with Your Class
          </h4>
          <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0 0" }}>
            Your standing compared to your class average (Section A • {cohort.totalStudents} classmates)
          </p>
        </div>
        <span style={{ fontSize: 11, background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: 12, fontWeight: 600 }}>
          Class Average
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {/* Attendance Cohort Card */}
        <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Attendance Standing</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, ...getBadgeStyle(attPercentile) }}>
              {attPercentile}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: currentAttendance < 75 ? "#ef4444" : "#1e293b" }}>
              {currentAttendance}%
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>vs {cohort.avgAttendance}% class avg</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(currentAttendance, 100)}%`,
                height: "100%",
                background: currentAttendance < 75 ? "#ef4444" : "#10b981",
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* Academic Marks Cohort Card */}
        <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Internal Assessment (CIA)</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, ...getBadgeStyle(acadPercentile) }}>
              {acadPercentile}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: currentAcademic < 50 ? "#ef4444" : "#1e293b" }}>
              {currentAcademic}/100
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>vs {cohort.avgAcademic}/100 class avg</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(currentAcademic, 100)}%`,
                height: "100%",
                background: currentAcademic < 50 ? "#ef4444" : "#3b82f6",
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* CGPA Cohort Card */}
        <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Cumulative GPA</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, ...getBadgeStyle(cgpaPercentile) }}>
              {cgpaPercentile}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#6366f1" }}>
              {currentCgpa}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>vs {cohort.avgCgpa} class avg</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min((currentCgpa / 10.0) * 100, 100)}%`,
                height: "100%",
                background: "#6366f1",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
