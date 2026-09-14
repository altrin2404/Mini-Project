import { useSim } from "../../../simulations/SimulationContext";
import { History, BarChart3 } from "lucide-react";
import "./digitalTwin.css";

export default function DigitalTwin() {
  const { activeStudent: s } = useSim();
  const t = s.twin;

  return (
    <div className="twin-page">
      <div className="twin-header">
        <h1>{s.name}'s Academic Reports</h1>
        <p>Explore historical performance and term-by-term report summaries.</p>
      </div>

      <div className="twin-grid">
        {/* Historical Progress Timeline */}
        <section className="timeline-card">
          <h3><div className="icon-box"><History size={20} /></div> Historical Progress Timeline</h3>

          <div className="timeline-list">
            {t.terms.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className={`dot ${i === 0 ? "active" : ""}`}></div>
                <div className={`term-box ${i === 0 ? "active" : ""}`}>
                  <span className="term-name">{item.term}</span>
                  <span className="term-grade">Overall: {item.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report Summary */}
        <section className="summary-card">
          <header className="summary-header">
            <div className="icon-box"><BarChart3 size={24} /></div>
            <div>
              <h3>{t.selectedTerm} Report Summary</h3>
            </div>
          </header>

          <p className="summary-text">{t.summary}</p>

          <footer className="stats-row">
            <div className="stat-item">
              <span className="label">Overall Grade:</span>
              <span className="value green">{t.grade}</span>
            </div>
            <div className="stat-item">
              <span className="label">Attendance:</span>
              <span className="value">{t.attendance}</span>
            </div>
            <div className="stat-item">
              <span className="label">Behavior:</span>
              <span
                className="value"
                style={{
                  color: t.behavior === "Exceptional" || t.behavior === "Good"
                    ? "#10b981"
                    : t.behavior === "Critical"
                    ? "#ef4444"
                    : "#f59e0b",
                }}
              >
                {t.behavior}
              </span>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
