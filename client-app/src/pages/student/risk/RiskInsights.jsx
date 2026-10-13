import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useSim } from "../../../simulations/SimulationContext";
import {
  Activity,
  PieChart,
  GraduationCap,
  Clock,
  Sparkles,
  Brain,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Send,
  RefreshCw,
  UserCheck,
  Users,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Award,
} from "lucide-react";
import {
  getLLMInsightsForStudent,
  answerLLMQuery,
  quickPrompts,
} from "../../../simulations/llmInsightsEngine";
import "./riskInsights.css";

export default function RiskInsights() {
  const { activeStudent: s } = useSim();
  const r = s.risk || {
    academic: 20,
    attendance: 10,
    behavior: 10,
    trend: [25, 20, 15, 10],
    riskLevel: "Low",
    riskColor: "#10b981",
  };

  const [llmData, setLlmData] = useState(() => getLLMInsightsForStudent(s));
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState("student");
  const [customQuestion, setCustomQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [askingQuestion, setAskingQuestion] = useState(false);

  // Update LLM data whenever the active student switches or updates
  useEffect(() => {
    setLlmData(getLLMInsightsForStudent(s));
    setAiAnswer(null);
  }, [s]);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLlmData(getLLMInsightsForStudent(s));
      setIsGenerating(false);
    }, 600);
  };

  const handleAskAI = (queryToAsk) => {
    const q = queryToAsk || customQuestion;
    if (!q || !q.trim()) return;
    setAskingQuestion(true);
    setTimeout(() => {
      const response = answerLLMQuery(q, s);
      setAiAnswer({ query: q, text: response, time: "Just now" });
      setAskingQuestion(false);
      setCustomQuestion("");
    }, 400);
  };

  const trendData = {
    labels: ["Month 1", "Month 2", "Month 3", "Current"],
    datasets: [
      {
        label: "Risk Score (%)",
        data: r.trend || [20, 18, 15, 12],
        borderColor: r.riskColor || "#10b981",
        backgroundColor: (r.riskColor || "#10b981") + "22",
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: r.riskColor || "#10b981",
        pointBorderWidth: 2,
      },
    ],
  };

  if (!llmData) return null;

  return (
    <div className="risk-page animate-fade-in-up">
      {/* ── HEADER WITH LLM STATUS ── */}
      <div className="risk-header">
        <div className="risk-header-info">
          <div className="ai-model-badge">
            <Sparkles size={14} className="sparkle-anim" />
            <span>{llmData.modelName}</span>
            <span className="confidence-chip">{llmData.confidence}% Diagnostic Confidence</span>
          </div>
          <h1>Digital Twin & LLM Insights</h1>
          <p>
            Natural-language diagnostics, attendance risk forecasting, and personalized recovery actions for{" "}
            <strong>{s.name}</strong>.
          </p>
        </div>

        <div className="risk-header-actions">
          <button
            className={`btn-regenerate ${isGenerating ? "spinning" : ""}`}
            onClick={handleRegenerate}
            disabled={isGenerating}
            title="Re-run LLM diagnostic model"
          >
            <RefreshCw size={15} className={isGenerating ? "spin-icon" : ""} />
            <span>{isGenerating ? "Analyzing..." : "Re-run LLM Analysis"}</span>
          </button>
          <div className="risk-badge-large" style={{ borderColor: llmData.riskColor, color: llmData.riskColor }}>
            <span className="dot" style={{ background: llmData.riskColor }}></span>
            {llmData.riskLevel} Risk Profile
          </div>
        </div>
      </div>

      {/* ── SECTION 1: EXECUTIVE LLM DIAGNOSTIC CARD ── */}
      <div className="llm-hero-card">
        <div className="llm-hero-header">
          <div className="llm-card-title">
            <div className="brain-icon-wrap">
              <Brain size={22} color="#6366f1" />
            </div>
            <div>
              <h3>Executive LLM Diagnostic Prognosis</h3>
              <span className="llm-timestamp">Real-time synthesis based on internal exams, labs & biometric logs</span>
            </div>
          </div>
          <span className="llm-status-pill">
            <ShieldCheck size={14} color="#10b981" />
            Verified by Digital Twin
          </span>
        </div>

        <div className="llm-prognosis-text">
          <p>{llmData.executiveSummary}</p>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="llm-metrics-strip">
          <div className="llm-metric-item">
            <span className="m-label">Status Trajectory</span>
            <strong className="m-val" style={{ color: llmData.riskColor }}>
              {llmData.trajectory}
            </strong>
          </div>
          <div className="llm-metric-item">
            <span className="m-label">Board Exam Eligibility</span>
            <strong className="m-val" style={{ color: llmData.riskLevel === "High" ? "#ef4444" : "#10b981" }}>
              {llmData.examEligibility}
            </strong>
          </div>
          <div className="llm-metric-item">
            <span className="m-label">Projected Final Attendance</span>
            <strong className="m-val">{llmData.projectedAttendance}</strong>
          </div>
          <div className="llm-metric-item">
            <span className="m-label">Projected SGPA / Grade</span>
            <strong className="m-val">{llmData.projectedGpa}</strong>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: MULTI-FACTOR LLM FINDINGS (STRENGTHS & BOTTLENECK CARDS) ── */}
      <div className="llm-findings-grid">
        {/* Strengths */}
        <div className="llm-panel-card strengths-card">
          <div className="panel-head">
            <div className="panel-icon-circle green">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4>Key Strengths & Anchors</h4>
              <span className="panel-sub">Verified academic stability indicators</span>
            </div>
          </div>

          <div className="findings-list">
            {llmData.strengths.map((item, idx) => (
              <div key={idx} className="finding-item positive">
                <div className="finding-bullet green">✓</div>
                <div className="finding-body">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Bottlenecks */}
        <div className="llm-panel-card risks-card">
          <div className="panel-head">
            <div className="panel-icon-circle amber">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4>Critical Bottlenecks & Cutoff Alerts</h4>
              <span className="panel-sub">Mandatory 75% attendance cutoff & exam risks</span>
            </div>
          </div>

          <div className="findings-list">
            {llmData.riskBottlenecks.map((item, idx) => (
              <div
                key={idx}
                className={`finding-item ${
                  item.severity === "critical"
                    ? "critical"
                    : item.severity === "warning"
                    ? "warning"
                    : "safe"
                }`}
              >
                <div className={`finding-bullet ${item.severity === "critical" ? "red" : item.severity === "warning" ? "amber" : "blue"}`}>
                  {item.severity === "critical" ? "!" : item.severity === "warning" ? "⚠" : "ℹ"}
                </div>
                <div className="finding-body">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: PRESCRIPTIVE AI ACTION PLAN (STUDENT / FACULTY / PARENT) ── */}
      <div className="llm-action-plan-card">
        <div className="action-plan-head">
          <div className="action-title-group">
            <div className="plan-icon-wrap">
              <TrendingUp size={20} color="#6366f1" />
            </div>
            <div>
              <h3>Prescriptive AI Action Plan</h3>
              <p>Step-by-step guidance tailored to each stakeholder</p>
            </div>
          </div>

          <div className="plan-tabs">
            <button
              className={`plan-tab ${activePlanTab === "student" ? "active" : ""}`}
              onClick={() => setActivePlanTab("student")}
            >
              <GraduationCap size={15} />
              <span>For Student</span>
            </button>
            <button
              className={`plan-tab ${activePlanTab === "faculty" ? "active" : ""}`}
              onClick={() => setActivePlanTab("faculty")}
            >
              <UserCheck size={15} />
              <span>For Faculty Mentor</span>
            </button>
            <button
              className={`plan-tab ${activePlanTab === "parent" ? "active" : ""}`}
              onClick={() => setActivePlanTab("parent")}
            >
              <Users size={15} />
              <span>For Parent</span>
            </button>
          </div>
        </div>

        <div className="action-plan-content">
          <div className="action-items-list">
            {(llmData.actionPlan[activePlanTab] || []).map((step, idx) => (
              <div key={idx} className="action-item-row">
                <div className="step-number">{idx + 1}</div>
                <div className="step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 4: INTERACTIVE "ASK DIGITAL TWIN LLM" ASSISTANT ── */}
      <div className="llm-chat-card">
        <div className="chat-card-header">
          <div className="chat-title-group">
            <div className="chat-icon-box">
              <MessageSquare size={18} color="#7c3aed" />
            </div>
            <div>
              <h3>Ask Digital Twin LLM Assistant</h3>
              <p>Ask any question about {s.name}'s attendance, internal marks, or exam eligibility.</p>
            </div>
          </div>
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="quick-chips-row">
          <span className="chips-label">Suggested:</span>
          {quickPrompts.map((q, idx) => (
            <button key={idx} className="quick-chip" onClick={() => handleAskAI(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="query-input-wrap">
          <input
            type="text"
            className="ai-query-input"
            placeholder={`Ask a question (e.g., "Will I be detained if I miss 2 classes?")`}
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAskAI();
            }}
          />
          <button
            className="btn-ask-ai"
            onClick={() => handleAskAI()}
            disabled={askingQuestion || !customQuestion.trim()}
          >
            {askingQuestion ? <RefreshCw size={15} className="spin-icon" /> : <Send size={15} />}
            <span>Ask AI</span>
          </button>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="ai-response-box animate-fade-in-up">
            <div className="response-header">
              <div className="response-title">
                <Sparkles size={15} color="#7c3aed" />
                <strong>LLM Twin Diagnostic Answer</strong>
              </div>
              <span className="response-time">{aiAnswer.time}</span>
            </div>
            <div className="response-question">Q: "{aiAnswer.query}"</div>
            <div className="response-text">
              {aiAnswer.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 5: QUANTITATIVE VISUALS & TELEMETRY (THE CHARTS) ── */}
      <div className="telemetry-section-divider">
        <div className="divider-line"></div>
        <span className="divider-badge">Supporting Quantitative Telemetry</span>
        <div className="divider-line"></div>
      </div>

      <div className="risk-grid">
        {/* Risk Trend Line Chart */}
        <div className="risk-card">
          <div className="risk-card-header">
            <h3>
              <div className="icon-box">
                <Activity size={20} />
              </div>
              Semester Risk Trajectory
            </h3>
            <button className="btn-score" style={{ background: r.riskColor + "22", color: r.riskColor }}>
              {r.riskLevel} Risk
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Calculated over the last 4 evaluation periods
          </p>
          <div className="chart-container">
            <Line
              data={trendData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 0, max: 100, border: { display: false }, grid: { color: "#f1f5f9" } },
                  x: { border: { display: false }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Risk Breakdown Progress Bars */}
        <div className="risk-card">
          <div className="risk-card-header">
            <h3>
              <div className="icon-box">
                <PieChart size={20} />
              </div>
              Category Breakdown
            </h3>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Weight Distribution</span>
          </div>

          <div className="breakdown-list">
            {/* Academic */}
            <div className="breakdown-item">
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "#dbeafe", color: "#3b82f6", padding: 6, borderRadius: 8 }}>
                      <GraduationCap size={16} />
                    </div>
                    Academic Performance (50% wt)
                  </div>
                  <span className="sub">Internal Tests & Practical Viva</span>
                </div>
                <span className="breakdown-percent">{r.academic}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${r.academic}%`, background: "#3b82f6" }}></div>
              </div>
            </div>

            {/* Attendance */}
            <div className="breakdown-item">
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "#dcfce7", color: "#10b981", padding: 6, borderRadius: 8 }}>
                      <Clock size={16} />
                    </div>
                    Biometric Attendance (30% wt)
                  </div>
                  <span className="sub">75% Mandatory Cutoff</span>
                </div>
                <span className="breakdown-percent" style={{ color: "#10b981" }}>
                  {r.attendance}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${r.attendance}%`, background: "#10b981" }}></div>
              </div>
            </div>

            {/* Behavior */}
            <div className="breakdown-item">
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "#fef3c7", color: "#f59e0b", padding: 6, borderRadius: 8 }}>⚡</div>
                    Classroom Conduct (20% wt)
                  </div>
                  <span className="sub">Punctuality & Participation</span>
                </div>
                <span className="breakdown-percent" style={{ color: "#f59e0b" }}>
                  {r.behavior}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${r.behavior}%`, background: "#f59e0b" }}></div>
              </div>
            </div>
          </div>

          {/* Composite Score Footer */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "#f8fafc",
              borderRadius: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", display: "block" }}>
                Composite Risk Index
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Calculated by Anna University Formula
              </span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: r.riskColor }}>
              {Math.round((r.academic + r.attendance + r.behavior) / 3)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
