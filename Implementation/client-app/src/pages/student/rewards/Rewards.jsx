import { useState } from "react";
import { useSim } from "../../../simulations/SimulationContext";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Crown,
  Sparkles,
  RotateCcw,
  Lock,
} from "lucide-react";
import "./rewards.css";

export default function Rewards() {
  const { activeStudent: s } = useSim();
  const r = s.rewards || {
    level: 1,
    levelTitle: "Freshman Scholar",
    currentXp: 500,
    nextLevelXp: 1000,
    rank: "#35 in Class",
    streaks: [],
    badges: [],
  };

  const [activeFilter, setActiveFilter] = useState("all");

  const getBadgeIcon = (iconName, size = 22) => {
    switch (iconName) {
      case "ShieldCheck": return <ShieldCheck size={size} />;
      case "ShieldAlert": return <ShieldAlert size={size} />;
      case "Trophy": return <Trophy size={size} />;
      case "Terminal": return <Terminal size={size} />;
      case "CheckCircle2": return <CheckCircle2 size={size} />;
      case "Crown": return <Crown size={size} />;
      case "RotateCcw": return <RotateCcw size={size} />;
      default: return <Sparkles size={size} />;
    }
  };

  const filteredBadges = (r.badges || []).filter(b => {
    if (activeFilter === "unlocked") return b.unlocked;
    if (activeFilter === "locked") return !b.unlocked;
    return true;
  });

  const xpPercent = Math.min(100, Math.round((r.currentXp / r.nextLevelXp) * 100));

  return (
    <div className="rewards-page animate-fade-in-up">
      {/* HEADER HERO */}
      <div className="rewards-hero-card">
        <div className="hero-left">
          <div className="hero-badge-tag">
            <Sparkles size={14} />
            <span>ACADEMIC MILESTONES & PROGRESS</span>
          </div>
          <h1>{s.name}'s Badges & Academic Progress</h1>
          <p>
            Track your biometric attendance streaks, exam distinction records, and semester milestones.
          </p>

          <div className="level-box">
            <div className="level-top-row">
              <div className="level-title-group">
                <span className="level-pill">Level {r.level}</span>
                <h3>{r.levelTitle}</h3>
              </div>
              <span className="rank-chip">
                <Crown size={14} color="#f59e0b" />
                {r.rank}
              </span>
            </div>

            <div className="xp-bar-container">
              <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }}></div>
            </div>

            <div className="xp-numbers-row">
              <span><strong>{r.currentXp.toLocaleString()} XP</strong> Earned</span>
              <span>Goal: <strong>{r.nextLevelXp.toLocaleString()} XP</strong> (Level {r.level + 1})</span>
            </div>
          </div>
        </div>

        <div className="hero-right-graphic">
          <div className="trophy-sphere">
            <Trophy size={64} color="#f59e0b" />
            <div className="xp-float-badge">+{r.currentXp} XP</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE STREAKS ROW */}
      <section className="streaks-section">
        <h3 className="section-title">
          <Flame size={20} color="#f97316" />
          <span>Active Academic & Attendance Streaks</span>
        </h3>

        <div className="streaks-grid">
          {(r.streaks || []).map(streak => (
            <div key={streak.id} className="streak-card">
              <div className="streak-icon-box" style={{ background: `${streak.color}18`, color: streak.color }}>
                {streak.icon === "Flame" && <Flame size={24} />}
                {streak.icon === "Zap" && <Zap size={24} />}
                {streak.icon === "Award" && <Award size={24} />}
                {streak.icon === "RotateCcw" && <RotateCcw size={24} />}
              </div>
              <div className="streak-content">
                <div className="streak-top">
                  <span className="streak-val" style={{ color: streak.color }}>{streak.value}</span>
                  <span className="streak-active-pill">ACTIVE 🔥</span>
                </div>
                <h4>{streak.name}</h4>
                <p>{streak.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ACHIEVEMENTS & BADGES ROOM */}
      <section className="badges-section">
        <div className="badges-header-row">
          <div>
            <h3 className="section-title">
              <Award size={20} color="#6366f1" />
              <span>Earned Badges & Milestones</span>
            </h3>
            <p className="section-subtitle">
              Milestones unlocked based on your real semester performance and attendance data.
            </p>
          </div>

          <div className="badge-filter-tabs">
            <button
              className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({(r.badges || []).length})
            </button>
            <button
              className={`filter-tab ${activeFilter === "unlocked" ? "active" : ""}`}
              onClick={() => setActiveFilter("unlocked")}
            >
              Unlocked ({(r.badges || []).filter(b => b.unlocked).length})
            </button>
            <button
              className={`filter-tab ${activeFilter === "locked" ? "active" : ""}`}
              onClick={() => setActiveFilter("locked")}
            >
              In Progress ({(r.badges || []).filter(b => !b.unlocked).length})
            </button>
          </div>
        </div>

        <div className="badges-grid">
          {filteredBadges.map(badge => (
            <div key={badge.id} className={`badge-card ${badge.unlocked ? "unlocked" : "locked"}`}>
              <div className="badge-header-row">
                <span className="badge-category">{badge.category}</span>
                <span className={`badge-status-chip ${badge.unlocked ? "green" : "gray"}`}>
                  {badge.unlocked ? badge.xp : <Lock size={12} />}
                </span>
              </div>

              <div className="badge-icon-wrap">
                <div className="badge-icon-circle">
                  {getBadgeIcon(badge.icon, 28)}
                </div>
              </div>

              <h4 className="badge-title">{badge.title}</h4>
              <p className="badge-desc">{badge.desc}</p>

              <div className="badge-footer">
                {badge.unlocked ? (
                  <span className="date-cleared">
                    <CheckCircle2 size={13} color="#10b981" />
                    {badge.date}
                  </span>
                ) : (
                  <span className="date-locked">
                    <Lock size={13} />
                    {badge.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
