import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
import { useSim } from "../../../simulations/SimulationContext";
import {
  Cpu,
  Activity,
  Zap,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  FlaskConical,
  BookOpen,
  Sparkles,
  RefreshCw,
  Sliders,
  History,
  Code,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  X,
  FileText,
  BarChart3,
  PieChart
} from "lucide-react";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeStudent: s } = useSim();
  const d = s.dashboard;
  const twin = s.twin || {};

  // Interactive What-If simulation slider state (Hypothetical Next IAT Exam Score)
  const [simulatedIatScore, setSimulatedIatScore] = useState(d.academic || 85);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Derive Digital Twin telemetry based on student persona
  const isHighRisk = s.id === 3 || d.academic < 50;
  const isComeback = s.id === 4;
  const isStar = s.id === 1;

  const predictedCgpa = isStar ? 9.38 : isHighRisk ? 4.82 : isComeback ? 8.24 : 7.15;
  const failureProb = isStar ? 1.4 : isHighRisk ? 76.5 : isComeback ? 5.8 : 12.0;
  const labScore = isStar ? 97 : isHighRisk ? 58 : isComeback ? 86 : 76;
  const twinFidelity = isStar ? "99.4%" : isHighRisk ? "94.2%" : "98.1%";

  // ─────────────────────────────────────────────────────────────
  // 1. MINI DOUGHNUT GAUGE CHARTS (TOP METRIC CARDS)
  // ─────────────────────────────────────────────────────────────
  const makeGaugeConfig = (value, max, color) => ({
    data: {
      datasets: [
        {
          data: [value, Math.max(0, max - value)],
          backgroundColor: [color, "#e2e8f0"],
          borderWidth: 0,
          circumference: 240,
          rotation: 240,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: { tooltip: { enabled: false }, legend: { display: false } },
    },
  });

  const cgpaGauge = makeGaugeConfig(predictedCgpa, 10, "#6366f1");
  const attendanceGauge = makeGaugeConfig(d.attendance, 100, "#10b981");
  const riskGauge = makeGaugeConfig(failureProb, 100, isHighRisk ? "#ef4444" : "#10b981");
  const labGauge = makeGaugeConfig(labScore, 100, "#f59e0b");

  // ─────────────────────────────────────────────────────────────
  // 2. RADAR CHART: DIGITAL TWIN COMPETENCY SPIDER GRAPH
  // ─────────────────────────────────────────────────────────────
  const radarLabels = [
    "Data Structures",
    "Operating Systems",
    "Database Systems",
    "Engineering Math",
    "Lab & Coding",
    "Attendance & Ethics",
  ];

  const studentCompetencies = isStar
    ? [96, 92, 95, 88, 98, 98]
    : isHighRisk
    ? [34, 42, 48, 31, 58, 52]
    : isComeback
    ? [82, 78, 80, 74, 88, 88]
    : [68, 64, 72, 62, 76, 79];

  const classBenchmark = [72, 68, 70, 65, 75, 80];

  const radarChartData = {
    labels: radarLabels,
    datasets: [
      {
        label: `${s.name}'s Scores`,
        data: studentCompetencies,
        backgroundColor: "rgba(99, 102, 241, 0.25)",
        borderColor: "#6366f1",
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#6366f1",
        borderWidth: 2.5,
      },
      {
        label: "Class Average",
        data: classBenchmark,
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        borderColor: "#94a3b8",
        borderDash: [4, 4],
        pointBackgroundColor: "#94a3b8",
        pointBorderColor: "#fff",
        borderWidth: 1.5,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { family: "Inter", size: 11, weight: "600" } },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { family: "Outfit", size: 12, weight: "bold" },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        min: 20,
        max: 100,
        ticks: { stepSize: 20, font: { size: 9 }, backdropColor: "transparent" },
        grid: { color: "rgba(226, 232, 240, 0.7)" },
        angleLines: { color: "rgba(226, 232, 240, 0.7)" },
        pointLabels: { font: { family: "Inter", size: 10, weight: "700" }, color: "#475569" },
      },
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 3. 8-SEMESTER GPA PROGRESSION (BAR CHART)
  // ─────────────────────────────────────────────────────────────
  const semGpaData = isStar
    ? [8.9, 9.1, 9.0, 9.3, 9.4, 9.5, 9.5, 9.6]
    : isHighRisk
    ? [6.2, 5.8, 5.4, 4.8, 4.5, 4.8, 5.0, 5.2]
    : isComeback
    ? [6.0, 6.5, 7.0, 7.6, 8.2, 8.5, 8.6, 8.8]
    : [7.2, 7.0, 6.8, 7.1, 7.0, 7.2, 7.3, 7.4];

  const barSemestersData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5 (Now)", "Sem 6 (Proj)", "Sem 7 (Proj)", "Sem 8 (Proj)"],
    datasets: [
      {
        label: "Semester GPA",
        data: semGpaData,
        backgroundColor: [
          "#6366f1",
          "#6366f1",
          "#6366f1",
          "#6366f1",
          "#10b981", // Active semester highlighted in green
          "rgba(99, 102, 241, 0.4)",
          "rgba(99, 102, 241, 0.4)",
          "rgba(99, 102, 241, 0.4)",
        ],
        borderColor: [
          "#4f46e5",
          "#4f46e5",
          "#4f46e5",
          "#4f46e5",
          "#059669",
          "#818cf8",
          "#818cf8",
          "#818cf8",
        ],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const barSemestersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        callbacks: {
          label: (ctx) => `GPA: ${ctx.parsed.y} / 10.0`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, font: { family: "Inter", size: 10 } },
        grid: { color: "rgba(226, 232, 240, 0.6)" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "Inter", size: 10, weight: "700" } },
      },
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 4. CONTINUOUS ASSESSMENTS COMPARISON (IAT 1 vs IAT 2 vs MODEL)
  // ─────────────────────────────────────────────────────────────
  const examComparisonData = {
    labels: ["Data Structures", "OS & Arch", "DBMS", "Discrete Math", "Full-Stack Lab"],
    datasets: [
      {
        label: "Internal 1 (IAT 1)",
        data: isStar
          ? [94, 90, 93, 86, 96]
          : isHighRisk
          ? [32, 38, 45, 28, 54]
          : [65, 62, 70, 60, 74],
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
      {
        label: "Internal 2 (IAT 2)",
        data: isStar
          ? [96, 94, 96, 90, 98]
          : isHighRisk
          ? [36, 44, 49, 34, 60]
          : [68, 66, 74, 64, 78],
        backgroundColor: "#10b981",
        borderRadius: 6,
      },
      {
        label: "Model Practical",
        data: isStar
          ? [98, 92, 95, 88, 97]
          : isHighRisk
          ? [52, 48, 55, 40, 58]
          : [75, 70, 76, 68, 80],
        backgroundColor: "#f59e0b",
        borderRadius: 6,
      },
    ],
  };

  const examComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 10, font: { family: "Inter", size: 10, weight: "700" } },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, callback: (v) => `${v}%`, font: { size: 10 } },
        grid: { color: "rgba(226, 232, 240, 0.6)" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "Inter", size: 10, weight: "600" } },
      },
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 5. PERFORMANCE TRAJECTORY & AI FORECAST LINE CHART
  // ─────────────────────────────────────────────────────────────
  const chartLabels = ["Month 1", "Month 2 (IAT 1)", "Month 3 (IAT 2)", "Month 4 (Model Lab)", "Month 5 (Final Exam Forecast)"];
  
  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Exam Marks (%)",
        data: [...d.trendAcademic, null],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
      {
        label: "Biometric Attendance (%)",
        data: [...d.trendAttendance, null],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        tension: 0.35,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "AI Predicted Marks (%)",
        data: [null, null, null, d.trendAcademic[3], Math.min(100, Math.round(d.trendAcademic[3] * 1.05))],
        borderColor: "#ec4899",
        borderDash: [6, 6],
        backgroundColor: "transparent",
        pointBackgroundColor: "#ec4899",
        pointBorderColor: "#fff",
        pointRadius: 6,
      },
    ],
  };

  // Dynamic calculation for What-If sandbox
  const simulatedProjectedCgpa = (
    predictedCgpa + (simulatedIatScore - d.academic) * 0.02
  ).toFixed(2);
  const simulatedRiskLevel =
    simulatedIatScore < 50 ? "High Risk (Improvement Exam Needed)" : simulatedIatScore < 70 ? "Average" : "Low Risk (Safe)";

  return (
    <div className="dashboard-page">
      {/* ── 1. DIGITAL TWIN HEADER ── */}
      <div className="dashboard-header-card">
        <div className="header-left-col">
          <div className="telemetry-meta-row">
            <span className="degree-tag">
              <BookOpen size={13} />
              B.E. Computer Science & Engineering • Year 3 • Semester 5
            </span>
            <div className="live-telemetry-pill">
              <span className="live-beacon"></span>
              <span>LIVE DIGITAL TWIN STATUS</span>
            </div>
            <span className="sync-chip">Model Accuracy: {twinFidelity}</span>
            <span className="latency-chip">Status: Online</span>
          </div>
          <h1>{s.name}'s Student Dashboard & Digital Twin 🔮</h1>
          <p>
            A clear visual overview of your marks, attendance, exam progress, and predicted grades.
          </p>
        </div>

        <div className="header-actions">
          <button
            className={`btn-sync-refresh ${isRefreshing ? "refreshing" : ""}`}
            onClick={handleRefresh}
            title="Refresh latest marks and attendance data"
          >
            <RefreshCw size={15} />
            <span>Refresh Data</span>
          </button>
          <button className="btn-view-report" onClick={() => setReportModal(true)}>
            <FileText size={15} />
            <span>Full Report</span>
          </button>
        </div>
      </div>

      {/* ── GAMIFIED XP & STREAK BANNER ── */}
      {s.rewards && (
        <div
          className="gamified-rewards-strip animate-fade-in-up"
          onClick={() => navigate("rewards")}
          title="Click to view all badges and academic progress"
        >
          <div className="gamified-strip-left">
            <div className="xp-level-badge">Level {s.rewards.level}</div>
            <div className="gamified-info">
              <div className="gamified-title-row">
                <strong>{s.rewards.levelTitle}</strong>
                <span className="rank-badge">{s.rewards.rank}</span>
              </div>
              <div className="mini-xp-bar-wrap">
                <div
                  className="mini-xp-bar-fill"
                  style={{ width: `${Math.round((s.rewards.currentXp / s.rewards.nextLevelXp) * 100)}%` }}
                ></div>
                <span className="mini-xp-text">{s.rewards.currentXp} / {s.rewards.nextLevelXp} XP</span>
              </div>
            </div>
          </div>

          <div className="gamified-strip-right">
            <div className="mini-streak-pill">
              <span className="flame-icon">🔥</span>
              <span><strong>{s.rewards.streaks?.[0]?.value || "32 Days"}</strong> Attendance Streak</span>
            </div>
            <button className="btn-strip-rewards">
              <span>View Badges & Status</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 2. TOP TIER: 4 VISUAL DOUGHNUT GAUGE CARDS ── */}
      <section className="gauge-cards-grid animate-fade-in-up">
        {/* Gauge 1: Predicted CGPA */}
        <div className="gauge-card">
          <div className="gauge-chart-box">
            <Doughnut data={cgpaGauge.data} options={cgpaGauge.options} />
            <div className="gauge-center-val">
              <strong>{predictedCgpa}</strong>
              <small>/ 10.0</small>
            </div>
          </div>
          <div className="gauge-info">
            <div className="gauge-tag purple">Predicted CGPA</div>
            <h4>Expected at Graduation</h4>
            <p className="gauge-delta" style={{ color: "#10b981" }}>
              <ArrowUpRight size={13} /> +0.22 above target
            </p>
          </div>
        </div>

        {/* Gauge 2: Biometric Attendance */}
        <div className="gauge-card">
          <div className="gauge-chart-box">
            <Doughnut data={attendanceGauge.data} options={attendanceGauge.options} />
            <div className="gauge-center-val">
              <strong style={{ color: "#10b981" }}>{d.attendance}%</strong>
              <small>Present</small>
            </div>
          </div>
          <div className="gauge-info">
            <div className="gauge-tag emerald">Attendance Rate</div>
            <h4>Biometric Attendance</h4>
            <p className="gauge-delta" style={{ color: "#10b981" }}>
              Cutoff: 75% (+23% extra)
            </p>
          </div>
        </div>

        {/* Gauge 3: Dropout Risk Index */}
        <div className="gauge-card">
          <div className="gauge-chart-box">
            <Doughnut data={riskGauge.data} options={riskGauge.options} />
            <div className="gauge-center-val">
              <strong style={{ color: isHighRisk ? "#ef4444" : "#10b981" }}>{failureProb}%</strong>
              <small>Risk</small>
            </div>
          </div>
          <div className="gauge-info">
            <div className={`gauge-tag ${isHighRisk ? "red" : "emerald"}`}>
              {isHighRisk ? "High Risk" : "Safe Zone"}
            </div>
            <h4>Risk of Failing / Arrears</h4>
            <p className="gauge-delta" style={{ color: isHighRisk ? "#ef4444" : "#10b981" }}>
              {isHighRisk ? "Extra Help Needed" : "Safe from Arrears"}
            </p>
          </div>
        </div>

        {/* Gauge 4: Lab & Practical Competency */}
        <div className="gauge-card">
          <div className="gauge-chart-box">
            <Doughnut data={labGauge.data} options={labGauge.options} />
            <div className="gauge-center-val">
              <strong style={{ color: "#f59e0b" }}>{labScore}</strong>
              <small>/ 100</small>
            </div>
          </div>
          <div className="gauge-info">
            <div className="gauge-tag amber">Lab Performance</div>
            <h4>Practical & Viva Marks</h4>
            <p className="gauge-delta" style={{ color: "#f59e0b" }}>
              {labScore >= 80 ? "Great Lab Performance" : "Needs More Lab Practice"}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. VISUALIZATION ROW 1: FORECAST LINE CHART + RADAR SPIDER CHART ── */}
      <section className="charts-main-grid animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        {/* LEFT: Multi-Dimensional Forecast Line Chart */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <div>
              <h3>
                <Activity size={18} color="#6366f1" />
                <span>Marks & Attendance Over Time (With AI Forecast)</span>
              </h3>
              <p className="chart-panel-desc">
                Your monthly marks and attendance, plus predicted marks for the final semester exams.
              </p>
            </div>
            <div className="chart-legend-row">
              <div className="legend-item"><span className="legend-dot purple"></span> Marks (%)</div>
              <div className="legend-item"><span className="legend-dot emerald"></span> Attendance (%)</div>
              <div className="legend-item"><span className="legend-dot pink dashed"></span> AI Forecast (%)</div>
            </div>
          </div>

          <div className="chart-frame-large">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    titleFont: { family: "Outfit", size: 13, weight: "bold" },
                    bodyFont: { family: "Inter", size: 12 },
                    padding: 12,
                    cornerRadius: 10,
                  },
                },
                scales: {
                  y: {
                    min: 20,
                    max: 100,
                    grid: { color: "rgba(226, 232, 240, 0.6)" },
                    ticks: {
                      font: { family: "Inter", size: 11 },
                      callback: (val) => `${val}%`,
                    },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { font: { family: "Inter", size: 11, weight: "600" } },
                  },
                },
              }}
            />
          </div>

          <div className="chart-footer-metrics">
            <div className="metric-badge">
              <span className="lbl">Performance Consistency:</span>
              <strong style={{ color: "#10b981" }}>Very Stable (98.4%)</strong>
            </div>
            <div className="metric-badge">
              <span className="lbl">Total Records Logged:</span>
              <strong>148 Entries</strong>
            </div>
            <div className="metric-badge">
              <span className="lbl">Extra Help Needed:</span>
              <strong style={{ color: isHighRisk ? "#ef4444" : "#6366f1" }}>
                {isHighRisk ? "Yes (Action Required)" : "None (On Track)"}
              </strong>
            </div>
          </div>
        </div>

        {/* RIGHT: Competency Radar Spider Web Chart */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <div>
              <h3>
                <Compass size={18} color="#8b5cf6" />
                <span>Subject Strengths & Skills</span>
              </h3>
              <p className="chart-panel-desc">
                How your subject scores compare with the class average.
              </p>
            </div>
          </div>

          <div className="chart-frame-radar">
            <Radar data={radarChartData} options={radarOptions} />
          </div>
        </div>
      </section>

      {/* ── 4. VISUALIZATION ROW 2: 8-SEMESTER BAR CHART + IAT ASSESSMENT COMPARISON ── */}
      <section className="charts-secondary-grid animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        {/* LEFT: 8-Semester GPA Progression Bar Chart */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <div>
              <h3>
                <BarChart3 size={18} color="#10b981" />
                <span>Semester-by-Semester GPA (Years 1 to 4)</span>
              </h3>
              <p className="chart-panel-desc">
                Your GPA from past semesters, current Semester 5, and predicted future semesters.
              </p>
            </div>
          </div>

          <div className="chart-frame-medium">
            <Bar data={barSemestersData} options={barSemestersOptions} />
          </div>

          <div className="benchmark-callout">
            <span className="dot emerald"></span>
            <span>Sem 5 (Current Active): <strong>{semGpaData[4]} GPA</strong></span>
            <span className="divider">•</span>
            <span>Anna University First Class with Distinction Cutoff: <strong>8.50 GPA</strong></span>
          </div>
        </div>

        {/* RIGHT: Continuous Assessment Comparison Grouped Bar Chart */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <div>
              <h3>
                <Layers size={18} color="#f59e0b" />
                <span>Internal Exams Comparison</span>
              </h3>
              <p className="chart-panel-desc">
                Subject-wise marks across Internal Exam 1 (IAT 1), Internal Exam 2 (IAT 2), and Model Practical.
              </p>
            </div>
          </div>

          <div className="chart-frame-medium">
            <Bar data={examComparisonData} options={examComparisonOptions} />
          </div>
        </div>
      </section>

      {/* ── 5. WHAT-IF SCORE CALCULATOR & RECENT ACTIVITY STREAM ── */}
      <section className="telemetry-bottom-grid animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        {/* WHAT-IF SIMULATION SANDBOX */}
        <div className="sandbox-card">
          <div className="sandbox-header">
            <div className="sandbox-icon-box">
              <Sliders size={20} color="#8b5cf6" />
            </div>
            <div>
              <h3>Test Your Exam Score ('What-If' Calculator)</h3>
              <p>Move the slider to see how your next internal exam changes your semester GPA.</p>
            </div>
          </div>

          <div className="slider-container">
            <div className="slider-label-row">
              <label>Estimated Internal Exam 2 (IAT 2) Score:</label>
              <span className="slider-val-badge">{simulatedIatScore}/100</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={simulatedIatScore}
              onChange={(e) => setSimulatedIatScore(parseInt(e.target.value, 10))}
              className="whatif-slider"
            />
            <div className="slider-ticks">
              <span>30 (Fail)</span>
              <span>50 (Pass Cutoff)</span>
              <span>75 (First Class)</span>
              <span>100 (Distinction)</span>
            </div>
          </div>

          {/* SIMULATED IMPACT OUTPUT CARDS */}
          <div className="simulation-results-grid">
            <div className="sim-result-box">
              <span className="res-lbl">Estimated Semester 5 GPA</span>
              <strong className="res-val" style={{ color: "#6366f1" }}>
                {simulatedProjectedCgpa}
              </strong>
            </div>

            <div className="sim-result-box">
              <span className="res-lbl">Need Improvement Exam?</span>
              <strong
                className="res-val"
                style={{ color: simulatedIatScore < 50 ? "#ef4444" : "#10b981" }}
              >
                {simulatedIatScore < 50 ? "Improvement Exam 2 Needed 🔄" : "Direct Pass (Safe) ✅"}
              </strong>
            </div>

            <div className="sim-result-box">
              <span className="res-lbl">Overall Standing</span>
              <strong className="res-val" style={{ color: "#0f172a", fontSize: 13 }}>
                {simulatedRiskLevel}
              </strong>
            </div>
          </div>
        </div>

        {/* RECENT STUDENT UPDATES FEED */}
        <div className="events-stream-card">
          <div className="stream-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="stream-icon-box">
                <History size={18} color="#10b981" />
              </div>
              <div>
                <h3>Recent Student Updates</h3>
                <p>Latest marks, attendance, and evaluation records.</p>
              </div>
            </div>
            <span className="event-count-badge">4 New</span>
          </div>

          <div className="stream-events-list">
            <div className="stream-event-item">
              <div className="event-dot emerald"></div>
              <div className="event-info">
                <strong>Biometric Attendance Marked</strong>
                <p>Scanned at Campus Block C (Lecture Hall 204)</p>
                <span className="event-time">Today, 08:42 AM</span>
              </div>
            </div>

            <div className="stream-event-item">
              <div className="event-dot purple"></div>
              <div className="event-info">
                <strong>Internal Exam 1 (IAT 1) Marks Added</strong>
                <p>Scored {d.academic}/100 in theory. Digital Twin updated.</p>
                <span className="event-time">Yesterday, 04:15 PM</span>
              </div>
            </div>

            <div className="stream-event-item">
              <div className="event-dot amber"></div>
              <div className="event-info">
                <strong>Model Practical Lab Test Passed</strong>
                <p>Lab experiment #7 verified with full marks.</p>
                <span className="event-time">2 days ago</span>
              </div>
            </div>

            <div className="stream-event-item">
              <div className="event-dot blue"></div>
              <div className="event-info">
                <strong>AI Grade Forecast Updated</strong>
                <p>Digital Twin updated with latest scores. Accuracy: {twinFidelity}.</p>
                <span className="event-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FULL ACADEMIC REPORT MODAL ── */}
      {reportModal && (
        <div className="modal-overlay" onClick={() => setReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setReportModal(false)}>
              <X size={16} />
            </button>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: 12, borderRadius: 12 }}>
                <FileText size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>Complete Academic Report</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  Summary of marks, attendance, and predictions for {s.name}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, background: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid var(--border)", fontSize: 14, color: "var(--text-main)", lineHeight: 1.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Predicted Final CGPA:</strong>
                <span style={{ color: "#6366f1", fontWeight: 800 }}>{predictedCgpa} / 10.0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Risk of Failing / Arrears:</strong>
                <span style={{ color: isHighRisk ? "#ef4444" : "#10b981", fontWeight: 800 }}>{failureProb}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Biometric Attendance:</strong>
                <span>{d.attendance}% (Cutoff: 75%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                <strong>Prediction Model:</strong>
                <span>Machine Learning (Trained on Academic History)</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
                {d.insight}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
