import { useSim } from "../../../simulations/SimulationContext";
import { SlidersHorizontal, CheckCircle, Wifi, AlertCircle, Clock, BookOpen, ExternalLink, MoreVertical, X } from "lucide-react";
import { useState } from "react";
import "./alerts.css";

const ICONS = {
  Clock: <Clock size={20} />,
  BookOpen: <BookOpen size={20} />,
  AlertCircle: <AlertCircle size={20} />,
  CheckCircle: <CheckCircle size={20} />,
};

export default function Alerts() {
  const { activeStudent: s } = useSim();
  const a = s.alerts;
  const totalCount = (a.critical ? 1 : 0) + a.items.length;

  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <div className="alerts-page">
      <header className="alerts-header">
        <div>
          <h1>Alerts</h1>
          <p>Stay updated with academic alerts for <strong>{s.name}</strong>.</p>
        </div>
        <div className="header-actions">
          <button className="btn-ghost"><SlidersHorizontal size={16} /> Filter</button>
          <button className="btn-ghost" onClick={() => alert("Marked all notifications as read.")}>
            <CheckCircle size={16} /> Mark all read
          </button>
        </div>
      </header>

      <div className="system-banner">
        <div className="icon-status"><Wifi size={24} /></div>
        <div className="system-info">
          <strong>System Online</strong>
          <p>All monitoring services are active.</p>
        </div>
        <span className="sync-tag">Last sync: Just now</span>
      </div>

      <div className="alert-tabs">
        <span className="tab active">All Alerts ({totalCount})</span>
        <span className="tab">Academic Risk</span>
        <span className="tab">Behavioral</span>
      </div>

      {/* Critical Alert Hero */}
      {a.critical && (
        <div className="alert-hero">
          <span className="badge">{a.critical.badge}</span>
          <span style={{ fontSize: 13, opacity: 0.8, marginLeft: 12 }}>{a.critical.type}</span>
          <h2>{a.critical.title}</h2>
          <p>{a.critical.msg}</p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => setSelectedAlert({ title: a.critical.title, msg: a.critical.msg, time: "Just now", icon: "AlertCircle" })}>
              Review Report →
            </button>
            <button className="btn-outline-white" onClick={() => alert("Intervention dismissed.")}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Alert List */}
      <div className="alert-list">
        {a.items.map((item, i) => (
          <div className="alert-item" key={i}>
            <div className={`alert-item-icon ${i % 2 === 0 ? "" : "blue"}`}>
              {ICONS[item.icon] || <Clock size={20} />}
            </div>
            <div className="alert-item-content">
              <header>
                <h4>{item.title}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="time">{item.time}</span>
                  <MoreVertical size={16} color="#64748b" />
                </div>
              </header>
              <p>{item.msg}</p>
              <button
                onClick={() => setSelectedAlert(item)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                className="btn-link"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}

        {totalCount === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: 16 }} />
            <p style={{ fontWeight: 600 }}>No active alerts — all clear!</p>
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAlert(null)}><X size={16} /></button>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: 12, borderRadius: 12 }}>
                {ICONS[selectedAlert.icon] || <Clock size={24} />}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{selectedAlert.title}</h2>
                <p style={{ color: "var(--text-light)", fontSize: 12, textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>
                  Logged: {selectedAlert.time}
                </p>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, background: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid var(--border)", marginBottom: 24 }}>
              <p>{selectedAlert.msg}</p>
              <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-light)" }}>
                This is a simulated predictive indicator generated by the Digital Twin event pipeline. No immediate action outside of the suggested intervention plan is required.
              </p>
            </div>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => setSelectedAlert(null)}>
              Dismiss Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
