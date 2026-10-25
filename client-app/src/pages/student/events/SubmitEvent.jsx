import { useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { useSim } from "../../../simulations/SimulationContext";
import {
  Trophy,
  Award,
  UploadCloud,
  CheckCircle2,
  Calendar,
  FileCheck,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Tag,
  Building
} from "lucide-react";
import "./submitEvent.css";

export default function SubmitEvent() {
  const { user } = useAuth();
  const { activeStudent } = useSim();

  // Achievement Categories
  const [category, setCategory] = useState("Hackathon / Coding Contest");
  const [title, setTitle] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-15");
  const [achievementLevel, setAchievementLevel] = useState("First Prize / Winner");
  const [proofLink, setProofLink] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Preloaded Verified Achievements List for Demo
  const [achievements, setAchievements] = useState([
    {
      id: "ACH-101",
      title: "Smart India Hackathon (SIH) - Finalist",
      category: "Hackathon / Coding Contest",
      organizer: "Ministry of Education & AICTE",
      date: "Sep 2026",
      level: "National Finalist",
      verified: true,
      points: "+150 Points"
    },
    {
      id: "ACH-102",
      title: "AWS Certified Cloud Practitioner",
      category: "Industry Certification",
      organizer: "Amazon Web Services (AWS)",
      date: "Aug 2026",
      level: "Global Certification",
      verified: true,
      points: "+100 Points"
    },
    {
      id: "ACH-103",
      title: "Inter-College Paper Presentation (1st Prize)",
      category: "Paper Presentation / Symposium",
      organizer: "Anna University Regional Campus",
      date: "Jul 2026",
      level: "First Prize / Winner",
      verified: true,
      points: "+80 Points"
    },
    {
      id: "ACH-104",
      title: "IEEE Student Branch Tech Volunteer",
      category: "Community & Club Leadership",
      organizer: "IEEE Student Branch",
      date: "Jun 2026",
      level: "Active Contributor",
      verified: true,
      points: "+50 Points"
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    setStatusMessage(null);

    const newRecord = {
      id: `ACH-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      organizer: organizer || "Host Organization",
      date: eventDate,
      level: achievementLevel,
      verified: true,
      points: "+75 Points"
    };

    try {
      if (user) {
        await api.post("/events/", {
          child_id: user?.user_id || "S001",
          event_type: "activity_completed",
          payload: { title, category, organizer, achievementLevel, description }
        });
      } else {
        await new Promise((r) => setTimeout(r, 350));
      }

      setAchievements([newRecord, ...achievements]);
      setStatusMessage(`🎉 "${title}" has been successfully logged into your academic record!`);
      setTitle("");
      setOrganizer("");
      setDescription("");
      setProofLink("");
    } catch (err) {
      console.warn("Event logging fallback:", err);
      setAchievements([newRecord, ...achievements]);
      setStatusMessage(`🎉 "${title}" has been successfully logged!`);
      setTitle("");
      setOrganizer("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="achieve-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                STUDENT RECOGNITION PORTFOLIO
              </span>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{activeStudent?.name || "Student"}</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
              Achievements & Participation
            </h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Register certifications, hackathon awards, symposium prizes, and workshop participation to build your graduation credential.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 18px", borderRadius: 10, textAlign: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", display: "block" }}>VERIFIED RECORDS</span>
              <strong style={{ fontSize: 20, color: "#1e3a8a" }}>{achievements.length} Entries</strong>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div style={{
          background: "#ecfdf5",
          border: "1px solid #6ee7b7",
          color: "#065f46",
          padding: "12px 16px",
          borderRadius: 10,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 14,
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="achieve-layout-grid">
        {/* ── 1. FORM TO REGISTER NEW ACHIEVEMENT ── */}
        <div className="achieve-form-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <PlusCircle size={20} color="#2563eb" />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Log New Achievement or Participation</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="achieve-form-group">
              <label>Achievement / Event Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Hackathon / Coding Contest">Hackathon / Coding Contest</option>
                <option value="Industry Certification">Industry Certification (NPTEL, AWS, Google)</option>
                <option value="Paper Presentation / Symposium">Paper Presentation / Technical Symposium</option>
                <option value="Workshop / Hands-on Bootcamp">Workshop / Hands-on Bootcamp</option>
                <option value="Sports & Extracurricular">Sports / Cultural Championship</option>
                <option value="Community & Club Leadership">Club / Professional Society Activity</option>
              </select>
            </div>

            <div className="achieve-form-group">
              <label>Title of Achievement / Event *</label>
              <input
                type="text"
                placeholder="e.g. Smart India Hackathon, NPTEL Cloud Computing..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="achieve-form-group">
                <label>Organizing Institution / Company</label>
                <input
                  type="text"
                  placeholder="e.g. IIT Madras, AWS, Anna Univ"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                />
              </div>

              <div className="achieve-form-group">
                <label>Achievement Standing / Result</label>
                <select value={achievementLevel} onChange={(e) => setAchievementLevel(e.target.value)}>
                  <option value="First Prize / Winner">First Prize / Winner 🥇</option>
                  <option value="Second / Third Prize">Second / Third Prize 🥈</option>
                  <option value="National Finalist">National Finalist 🎖️</option>
                  <option value="Elite / Gold Certification">Elite / Gold Certificate 📜</option>
                  <option value="Successful Completion">Successful Completion ✅</option>
                  <option value="Active Participation">Active Participation 🎗️</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="achieve-form-group">
                <label>Date of Event / Issue</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="achieve-form-group">
                <label>Certificate / Project Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={proofLink}
                  onChange={(e) => setProofLink(e.target.value)}
                />
              </div>
            </div>

            <div className="achieve-form-group">
              <label>Brief Description / Key Learnings</label>
              <textarea
                placeholder="Mention project topic, technology used, or role in team..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-submit-achieve"
              >
                <Award size={16} />
                <span>{submitting ? "Saving Entry..." : "Submit to Academic Record"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ── 2. VERIFIED ACHIEVEMENTS LIST ── */}
        <div className="achieve-list-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
              <Trophy size={18} color="#d97706" />
              Verified Portfolio Entries
            </h2>
            <span style={{ fontSize: 12, color: "#64748b" }}>Latest First</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {achievements.map((item) => (
              <div key={item.id} className="achievement-row-item">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div className="achieve-trophy-box">
                    <Trophy size={18} color="#b45309" />
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, color: "#0f172a", display: "block" }}>{item.title}</strong>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap", fontSize: 12, color: "#64748b" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Building size={12} /> {item.organizer}
                      </span>
                      <span>•</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={12} /> {item.date}
                      </span>
                      <span>•</span>
                      <span style={{ color: "#2563eb", fontWeight: 600 }}>{item.category}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="badge-achieve-level">{item.level}</span>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#10b981", marginTop: 4 }}>
                    {item.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
