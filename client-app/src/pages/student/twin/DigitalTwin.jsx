import { useState } from "react";
import { useSim } from "../../../simulations/SimulationContext";
import {
  GraduationCap,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";
import "./digitalTwin.css";

export default function DigitalTwin() {
  const { activeStudent: s } = useSim();
  const t = s.twin;
  const semesters = t.semesters || [];

  // Default to active semester (Sem 5) or first semester
  const [selectedSemNum, setSelectedSemNum] = useState(t.currentSemester || 5);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(1); // default to IAT 1

  const currentSem = semesters.find((item) => item.semNumber === selectedSemNum) || semesters[0];
  const milestones = currentSem?.milestones || [];
  const selectedMilestone = milestones[selectedMilestoneIndex] || milestones[0];

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Emerald
    if (score >= 60) return "#6366f1"; // Indigo
    if (score >= 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  return (
    <div className="twin-page">
      {/* HEADER */}
      <div className="twin-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span className="degree-pill">
              <GraduationCap size={15} />
              4-Year B.E. Degree • 8 Semesters
            </span>
            <span className="current-sem-pill">Active: Semester {t.currentSemester || 5}</span>
          </div>
          <h1>{s.name}'s Academic Progress & Digital Twin</h1>
          <p>
            Track your progress across 2 Internal Exams (IAT 1 & 2), Improvement Exams, Model Practical, and End Semester Examinations.
          </p>
        </div>
      </div>

      {/* 4-YEAR / 8-SEMESTER NAVIGATOR BAR */}
      <div className="semester-nav-card">
        <div className="semester-nav-title">
          <Layers size={16} color="#6366f1" />
          <span>Select Semester (4 Years • 8 Semesters):</span>
        </div>
        <div className="semester-pills-row">
          {semesters.map((sem) => {
            const isSelected = sem.semNumber === selectedSemNum;
            const isCurrent = sem.semNumber === (t.currentSemester || 5);
            return (
              <button
                key={sem.semNumber}
                className={`sem-pill-btn ${isSelected ? "active" : ""} ${isCurrent ? "current" : ""}`}
                onClick={() => {
                  setSelectedSemNum(sem.semNumber);
                  setSelectedMilestoneIndex(1); // Reset to IAT 1
                }}
              >
                <div className="sem-pill-top">
                  <span className="sem-num">Sem {sem.semNumber}</span>
                  <span className="sem-yr">Yr {sem.yearNumber}</span>
                </div>
                <div className="sem-pill-bottom">
                  <span className={`sem-status-dot ${sem.statusBadge}`}></span>
                  <span className="sem-grade">{sem.grade || "--"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="twin-grid">
        {/* LEFT COLUMN: SEMESTER ASSESSMENT FLOWCHART */}
        <section className="timeline-card">
          <div className="timeline-header-bar">
            <div>
              <h3>
                <div className="icon-box">
                  <Clock size={20} />
                </div>
                <span>Semester {currentSem.semNumber} Exam Journey</span>
              </h3>
              <p className="timeline-subtitle">
                Sequence: Start → IAT 1 → (Improvement 1) → IAT 2 → (Improvement 2) → Model Practical → End Sem Practical → End Sem Theory
              </p>
            </div>
            <span className={`status-badge-lg ${currentSem.statusBadge}`}>
              {currentSem.status}
            </span>
          </div>

          <div className="milestones-flow">
            {milestones.map((m, idx) => {
              const isSelected = selectedMilestoneIndex === idx;
              const hasImprovement = !!m.improvementExam;

              return (
                <div key={m.id} className="milestone-step-wrapper">
                  {/* Step Card */}
                  <div
                    className={`milestone-card ${isSelected ? "selected" : ""} ${m.improvementExam ? "has-retest" : ""}`}
                    onClick={() => setSelectedMilestoneIndex(idx)}
                  >
                    <div className="step-num-badge">{m.index}</div>
                    
                    <div className="step-body">
                      <div className="step-row-top">
                        <span className="step-type">{m.type}</span>
                        {m.score !== undefined ? (
                          <span className="step-score" style={{ color: getScoreColor(m.score) }}>
                            {m.score}/100
                          </span>
                        ) : (
                          <span className="step-status-tag">{m.status}</span>
                        )}
                      </div>

                      <h4 className="step-title">{m.title}</h4>
                      {m.assessment && <span className="step-assessment">{m.assessment}</span>}
                    </div>

                    <ChevronRight size={18} className="step-chevron" />
                  </div>

                  {/* BRANCHED IMPROVEMENT EXAM (If Failed Internal) */}
                  {hasImprovement && (
                    <div
                      className="improvement-branch-card"
                      onClick={() => setSelectedMilestoneIndex(idx)}
                    >
                      <div className="branch-line"></div>
                      <div className="branch-content">
                        <div className="branch-tag">
                          <RotateCcw size={12} />
                          <span>Improvement Exam Needed</span>
                        </div>
                        <div className="branch-info">
                          <strong>{m.improvementExam.title}</strong>
                          <span className="branch-score" style={{ color: getScoreColor(m.improvementExam.score) }}>
                            Retest: {m.improvementExam.score}/100 ({m.improvementExam.status})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: DETAILED MILESTONE & DIGITAL TWIN PROGNOSIS */}
        <section className="summary-card">
          <header className="summary-header">
            <div className="icon-box">
              <Sparkles size={24} />
            </div>
            <div>
              <h3>Exam Details: {selectedMilestone.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Semester {currentSem.semNumber} • {selectedMilestone.type}
              </p>
            </div>
          </header>

          {/* ACTIVE MILESTONE METRIC CARD */}
          <div className="milestone-detail-card">
            <div className="detail-top-row">
              <div>
                <span className="detail-label">Status & Result</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {selectedMilestone.status || "Completed"}
                </h4>
              </div>

              {selectedMilestone.score !== undefined && (
                <div className="score-circular-badge" style={{ borderColor: getScoreColor(selectedMilestone.score) }}>
                  <span className="score-num" style={{ color: getScoreColor(selectedMilestone.score) }}>
                    {selectedMilestone.score}
                  </span>
                  <span className="score-denom">/ 100</span>
                </div>
              )}
            </div>

            {selectedMilestone.score !== undefined && (
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${selectedMilestone.score}%`,
                    background: getScoreColor(selectedMilestone.score),
                  }}
                ></div>
              </div>
            )}

            <p className="detail-description">{selectedMilestone.details}</p>

            {/* IF IMPROVEMENT RETEST IS ATTACHED */}
            {selectedMilestone.improvementExam && (
              <div className="improvement-callout-box">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  <strong>Improvement Exam Result</strong>
                </div>
                <p style={{ fontSize: 13, color: "#92400e", marginBottom: 8 }}>
                  {selectedMilestone.improvementExam.note}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span>Original: <strong>{selectedMilestone.score}/100 (Below 50% Cutoff)</strong></span>
                  <ArrowRight size={14} />
                  <span>Improvement Retest: <strong style={{ color: "#10b981" }}>{selectedMilestone.improvementExam.score}/100</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* DIGITAL TWIN AI SYNTHESIS */}
          <div className="twin-ai-box">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <TrendingUp size={18} color="#6366f1" />
              <strong>Digital Twin AI Feedback</strong>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.6 }}>
              {selectedMilestone.score !== undefined && selectedMilestone.score >= 80 ? (
                <span>
                  Great score in <strong>{selectedMilestone.title}</strong>! This keeps {s.name}'s predicted graduation GPA strong at <strong>{currentSem.gpa}</strong>.
                </span>
              ) : selectedMilestone.score !== undefined && selectedMilestone.score < 50 ? (
                <span>
                  Score in <strong>{selectedMilestone.title}</strong> was below passing cutoff. Improvement Exam was taken to clear the subject.
                </span>
              ) : (
                <span>
                  {currentSem.summary}
                </span>
              )}
            </p>
          </div>

          {/* SEMESTER SUMMARY STATS ROW */}
          <footer className="stats-row">
            <div className="stat-item">
              <span className="label">Semester GPA:</span>
              <span className="value green">{currentSem.gpa}</span>
            </div>
            <div className="stat-item">
              <span className="label">Attendance:</span>
              <span className="value">{currentSem.attendance}</span>
            </div>
            <div className="stat-item">
              <span className="label">Conduct:</span>
              <span
                className="value"
                style={{
                  color:
                    currentSem.behavior === "Exceptional" || currentSem.behavior === "Good"
                      ? "#10b981"
                      : currentSem.behavior === "Critical"
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              >
                {currentSem.behavior}
              </span>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
