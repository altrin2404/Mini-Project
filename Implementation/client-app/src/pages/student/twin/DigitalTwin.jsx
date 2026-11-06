import { useState, useMemo } from "react";
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
  ArrowRight,
  Cpu,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Target,
  FileText,
  BarChart3,
  Radar
} from "lucide-react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js";
import { Radar as RadarChart, Line as LineChart } from "react-chartjs-2";
import "./digitalTwin.css";

// Register ChartJS elements
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export default function DigitalTwin() {
  const { activeStudent: s } = useSim();
  const t = s.twin || {};
  const semesters = t.semesters || [];

  // Active Semester and Milestone Selection
  const [selectedSemNum, setSelectedSemNum] = useState(t.currentSemester || 5);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(1);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "radar" | "timeline"

  const currentSem = semesters.find((item) => item.semNumber === selectedSemNum) || semesters[0] || {};
  const milestones = currentSem?.milestones || [];
  const selectedMilestone = milestones[selectedMilestoneIndex] || milestones[0] || {};

  // Color helper based on grade/score
  const getScoreColor = (score) => {
    if (score === undefined || score === null) return "#64748b";
    if (score >= 80) return "#10b981"; // Emerald
    if (score >= 65) return "#3b82f6"; // Blue
    if (score >= 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  // Derive Twin Health Index (0 - 100)
  const healthMetrics = useMemo(() => {
    const rawAtt = parseFloat(String(currentSem.attendance || "85").replace("%", "")) || 85;
    const rawGpa = parseFloat(currentSem.gpa) || 7.5;
    const academicScore = Math.min(Math.round((rawGpa / 10.0) * 100), 100);
    const attendanceScore = Math.min(Math.round(rawAtt), 100);
    const conductScore = currentSem.behavior === "Exceptional" ? 95 : currentSem.behavior === "Good" ? 85 : currentSem.behavior === "Moderate" ? 70 : 50;

    // Composite Living Digital Twin Health
    const compositeHealth = Math.round((academicScore * 0.45) + (attendanceScore * 0.35) + (conductScore * 0.20));

    let statusLabel = "Optimal State";
    let statusColor = "#10b981";
    let stateBadge = "SYNCHRONIZED";
    if (compositeHealth < 60 || rawAtt < 75) {
      statusLabel = "Critical Intervene State";
      statusColor = "#ef4444";
      stateBadge = "ATTENTION REQUIRED";
    } else if (compositeHealth < 75) {
      statusLabel = "Guarded Progress State";
      statusColor = "#f59e0b";
      stateBadge = "MONITORING";
    }

    return {
      compositeHealth,
      statusLabel,
      statusColor,
      stateBadge,
      academicScore,
      attendanceScore,
      conductScore,
      rawAtt,
      rawGpa
    };
  }, [currentSem]);

  // Multidimensional Telemetry Radar Data
  const radarData = useMemo(() => {
    return {
      labels: [
        "Internal Exam 1 (IAT 1)",
        "Internal Exam 2 (IAT 2)",
        "Biometric Attendance",
        "Lab Practical Execution",
        "Discipline & Conduct",
        "Continuous Homework"
      ],
      datasets: [
        {
          label: `${s.name}'s Virtual Twin`,
          data: [
            milestones[1]?.score || healthMetrics.academicScore,
            milestones[2]?.score || (healthMetrics.academicScore - 4),
            healthMetrics.attendanceScore,
            selectedMilestoneIndex === 3 ? (selectedMilestone.score || 88) : 85,
            healthMetrics.conductScore,
            Math.min(healthMetrics.academicScore + 5, 98)
          ],
          backgroundColor: "rgba(99, 102, 241, 0.22)",
          borderColor: "#6366f1",
          borderWidth: 2.5,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#6366f1",
          pointRadius: 4,
        },
        {
          label: "Class Passing Benchmark",
          data: [50, 50, 75, 60, 70, 60],
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          borderColor: "#ef4444",
          borderDash: [4, 4],
          borderWidth: 1.5,
          pointBackgroundColor: "#ef4444",
          pointRadius: 3,
        }
      ]
    };
  }, [milestones, healthMetrics, s.name, selectedMilestone, selectedMilestoneIndex]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(203, 213, 225, 0.4)" },
        grid: { color: "rgba(203, 213, 225, 0.4)" },
        suggestedMin: 30,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: {
          font: { size: 11, weight: "600", family: "system-ui" },
          color: "#475569"
        }
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 12, weight: "600" } }
      }
    }
  };

  // 8-Semester Progression Trajectory Curve
  const progressionData = useMemo(() => {
    const validSems = semesters.filter(sm => sm.gpa && parseFloat(sm.gpa) > 0);
    return {
      labels: semesters.map(sm => `Sem ${sm.semNumber}`),
      datasets: [
        {
          label: "Semester GPA History",
          data: semesters.map(sm => parseFloat(sm.gpa) || null),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#fff",
          spanGaps: true
        }
      ]
    };
  }, [semesters]);

  const progressionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 4,
        max: 10,
        ticks: { stepSize: 1, font: { size: 10 } },
        grid: { color: "rgba(226, 232, 240, 0.6)" }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: "600" } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="twin-page">
      {/* ── 1. DIGITAL TWIN COMMAND HEADER ── */}
      <div className="twin-hero-banner">
        <div className="hero-glow-blob"></div>
        <div className="hero-content-row">
          <div>
            <div className="twin-meta-badges">
              <span className="degree-pill">
                <GraduationCap size={14} />
                B.E. Computer Science & Engineering • 8 Semesters
              </span>
              <span className="telemetry-live-pill">
                <span className="pulsing-beacon"></span>
                ACTIVE DIGITAL TWIN TELEMETRY
              </span>
              <span className="synced-chip">Fidelity: 99.4% Synchronized</span>
            </div>
            <h1 className="hero-title">{s.name}'s Virtual Academic Twin</h1>
            <p className="hero-subtitle">
              High-fidelity living model continuously updated on every biometric swipe, internal assessment (IAT 1 & 2), practical evaluation, and improvement test.
            </p>
          </div>

          {/* Twin Overall Health Gauge */}
          <div className="twin-health-stat-card">
            <div className="health-stat-top">
              <span className="health-label">Composite Twin Score</span>
              <span className="health-badge" style={{ backgroundColor: `${healthMetrics.statusColor}1a`, color: healthMetrics.statusColor, border: `1px solid ${healthMetrics.statusColor}40` }}>
                {healthMetrics.stateBadge}
              </span>
            </div>
            <div className="health-number-row">
              <span className="health-value" style={{ color: healthMetrics.statusColor }}>
                {healthMetrics.compositeHealth}
              </span>
              <span className="health-denom">/100</span>
            </div>
            <div className="health-progress-wrap">
              <div
                className="health-progress-bar"
                style={{ width: `${healthMetrics.compositeHealth}%`, backgroundColor: healthMetrics.statusColor }}
              ></div>
            </div>
            <span className="health-status-desc">{healthMetrics.statusLabel}</span>
          </div>
        </div>
      </div>

      {/* ── 2. 8-SEMESTER DEGREE JOURNEY HORIZONTAL NAVIGATOR ── */}
      <div className="semester-journey-card">
        <div className="journey-header">
          <div className="journey-title">
            <Layers size={18} color="#6366f1" />
            <span>4-Year Engineering Journey (Click to View Past / Active Semester):</span>
          </div>
          <span className="active-sem-tag">Currently Active: Semester {t.currentSemester || 5}</span>
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
                  setSelectedMilestoneIndex(1);
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

      {/* ── 3. VISUAL TELEMETRY COCKPIT (Radar + Progression + Milestone Analytics) ── */}
      <div className="twin-cockpit-grid">
        {/* Cockpit Left: Multidimensional Radar & Trajectory */}
        <div className="cockpit-card radar-cockpit">
          <div className="cockpit-header">
            <div className="cockpit-title-wrap">
              <div className="icon-badge radar-icon">
                <Radar size={18} />
              </div>
              <div>
                <h3>Multidimensional Twin Attribute Matrix</h3>
                <p>Real-time cross-axial performance against university pass thresholds.</p>
              </div>
            </div>
            <span className="metric-pill">Semester {currentSem.semNumber}</span>
          </div>

          <div className="radar-chart-container">
            <RadarChart data={radarData} options={radarOptions} />
          </div>

          {/* Quick Metrics Strip */}
          <div className="cockpit-metrics-strip">
            <div className="mini-metric">
              <span className="mini-lbl">Semester GPA</span>
              <strong className="mini-val" style={{ color: "#10b981" }}>{currentSem.gpa || "--"}</strong>
            </div>
            <div className="mini-metric">
              <span className="mini-lbl">Biometric Att.</span>
              <strong className="mini-val" style={{ color: healthMetrics.rawAtt < 75 ? "#ef4444" : "#1e293b" }}>
                {currentSem.attendance || "--"}
              </strong>
            </div>
            <div className="mini-metric">
              <span className="mini-lbl">Conduct State</span>
              <strong className="mini-val" style={{ color: "#6366f1" }}>{currentSem.behavior || "Normal"}</strong>
            </div>
          </div>
        </div>

        {/* Cockpit Right: 8-Semester Progression & Cumulative Forecast */}
        <div className="cockpit-card trajectory-cockpit">
          <div className="cockpit-header">
            <div className="cockpit-title-wrap">
              <div className="icon-badge curve-icon">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3>8-Semester CGPA Trajectory</h3>
                <p>Historical momentum across all engineering semesters.</p>
              </div>
            </div>
            <span className="forecast-tag">Ridge Projected: {s.dashboard?.cgpa || currentSem.gpa || "8.2"}</span>
          </div>

          <div className="trajectory-chart-container">
            <LineChart data={progressionData} options={progressionOptions} />
          </div>

          {/* AI Prognosis Banner */}
          <div className="twin-ai-prognosis-banner">
            <div className="prognosis-icon-circle">
              <Sparkles size={18} color="#6366f1" />
            </div>
            <div className="prognosis-text">
              <strong>Digital Twin AI Prognosis:</strong>
              <p>
                {currentSem.summary ||
                  `${s.name}'s digital twin shows solid trajectory alignment with optimal semester graduation markers.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DETAILED EXAM JOURNEY (Milestone Flowchart & Deep Dive Inspector) ── */}
      <div className="twin-grid">
        {/* LEFT COLUMN: SEMESTER ASSESSMENT FLOWCHART */}
        <section className="timeline-card">
          <div className="timeline-header-bar">
            <div>
              <h3>
                <div className="icon-box">
                  <Clock size={20} />
                </div>
                <span>Semester {currentSem.semNumber} Examination Sequence</span>
              </h3>
              <p className="timeline-subtitle">
                Complete progression: Start → IAT 1 → Improvement Retest → IAT 2 → Model Practical → End Sem Exam
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

                  {/* BRANCHED IMPROVEMENT EXAM (If Retest was needed) */}
                  {hasImprovement && (
                    <div
                      className="improvement-branch-card"
                      onClick={() => setSelectedMilestoneIndex(idx)}
                    >
                      <div className="branch-line"></div>
                      <div className="branch-content">
                        <div className="branch-tag">
                          <RotateCcw size={12} />
                          <span>Improvement Exam Required</span>
                        </div>
                        <div className="branch-info">
                          <strong>{m.improvementExam.title}</strong>
                          <span className="branch-score" style={{ color: getScoreColor(m.improvementExam.score) }}>
                            Retest Result: {m.improvementExam.score}/100 ({m.improvementExam.status})
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
              <h3>Exam Detail: {selectedMilestone.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Semester {currentSem.semNumber} • {selectedMilestone.type}
              </p>
            </div>
          </header>

          {/* ACTIVE MILESTONE METRIC CARD */}
          <div className="milestone-detail-card">
            <div className="detail-top-row">
              <div>
                <span className="detail-label">Evaluation State</span>
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
                  <strong>Improvement Exam Notice & Verification</strong>
                </div>
                <p style={{ fontSize: 13, color: "#92400e", marginBottom: 8 }}>
                  {selectedMilestone.improvementExam.note}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span>Original: <strong>{selectedMilestone.score}/100 (&lt;50% Cutoff)</strong></span>
                  <ArrowRight size={14} />
                  <span>Improvement Score: <strong style={{ color: "#10b981" }}>{selectedMilestone.improvementExam.score}/100</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* DIGITAL TWIN AI SYNTHESIS */}
          <div className="twin-ai-box">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <TrendingUp size={18} color="#6366f1" />
              <strong>Digital Twin AI Synthesized Feedback</strong>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.6 }}>
              {selectedMilestone.score !== undefined && selectedMilestone.score >= 80 ? (
                <span>
                  High-distinction performance in <strong>{selectedMilestone.title}</strong>! Keeps {s.name}'s predicted graduation CGPA strong at <strong>{currentSem.gpa}</strong>.
                </span>
              ) : selectedMilestone.score !== undefined && selectedMilestone.score < 50 ? (
                <span>
                  Score in <strong>{selectedMilestone.title}</strong> fell below the 50% passing cutoff. The Digital Twin triggered an automated Improvement Exam workflow to prevent academic arrear.
                </span>
              ) : (
                <span>{currentSem.summary}</span>
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
