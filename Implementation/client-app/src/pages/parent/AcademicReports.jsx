import { useSim } from "../../simulations/SimulationContext";
import { FileText, Clock, X, CheckCircle, Download } from "lucide-react";
import { useState } from "react";
import "./parentDashboard.css";

export default function AcademicReports() {
  const { activeParent: p } = useSim();
  const r = p.reports;

  const [downloadModal, setDownloadModal] = useState(false);

  const gradeColor = (g) => {
    if (g.startsWith("A")) return "#10b981";
    if (g.startsWith("B")) return "#6366f1";
    if (g.startsWith("C")) return "#f59e0b";
    return "#ef4444";
  };

  const triggerDownload = () => {
    setDownloadModal(true);
    // Mock downloading flow
    setTimeout(() => {
      // Trigger a file download in browser
      const element = document.createElement("a");
      const file = new Blob([`Official Academic Progress Report for ${p.childName}\nTerm Grade: ${r.selectedGrade}\nAttendance: ${r.attendance}\nBehavior: ${r.behavior}\n\nSummary:\n${r.summary}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${p.childName.replace(/\s+/g, '_')}_Academic_Report.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div className="parent-page">
      <header className="parent-header">
        <div>
          <h1>{p.childName}'s Academic Reports</h1>
          <p>Explore historical performance and download detailed reports for each term.</p>
        </div>
      </header>

      <div className="admin-grid">
        <div className="admin-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Clock size={20} color="#6366f1" /> Historical Progress Timeline
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {r.terms.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 20px",
                  background: i === 0 ? "#eff6ff" : "#f8fafc",
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: i === 0 ? "1px solid #bfdbfe" : "1px solid transparent",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, color: i === 0 ? "#1e40af" : "#1e293b" }}>{item.term}</p>
                  <p style={{ fontSize: 12, color: "#64748b" }}>Overall: {item.grade}</p>
                </div>
                <span style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: gradeColor(item.grade),
                }}>
                  {item.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <FileText size={20} color="#6366f1" />
            <h3>Latest Term Report Summary</h3>
          </header>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            {r.summary}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Overall Grade:</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: gradeColor(r.selectedGrade) }}>{r.selectedGrade}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Attendance:</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#1e293b" }}>{r.attendance}</p>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Behavior:</p>
            <p style={{
              fontSize: 18,
              fontWeight: 700,
              color: r.behavior === "Exceptional" || r.behavior === "Good"
                ? "#10b981"
                : r.behavior === "Critical" ? "#ef4444" : "#f59e0b",
            }}>
              {r.behavior}
            </p>
          </div>
          <button
            onClick={triggerDownload}
            style={{
              marginTop: 32,
              padding: "12px 24px",
              borderRadius: 12,
              background: "#6366f1",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              width: "100%",
            }}
          >
            📄 Download Full Report
          </button>
        </div>
      </div>

      {/* Download Modal */}
      {downloadModal && (
        <div className="modal-overlay" onClick={() => setDownloadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDownloadModal(false)}><X size={16} /></button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 0" }}>
              <div style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Download size={36} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Generating PDF Report</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8, maxWidth: 400, lineHeight: 1.6 }}>
                Our ML compilation pipeline is preparing the complete report layout for {p.childName}. The download will start automatically in a moment.
              </p>
              <button className="btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => setDownloadModal(false)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
