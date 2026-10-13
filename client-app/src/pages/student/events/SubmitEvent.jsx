import { useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { Send, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import "./submitEvent.css";

export default function SubmitEvent() {
  const { user } = useAuth();
  const [eventType, setEventType] = useState("attendance_marked");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState(85);
  const [isCritical, setIsCritical] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    // Build payload based on event type
    let payload = { note: description || "Manual student event submission", critical: isCritical };
    if (eventType === "attendance_marked") {
      payload = { present: true, note: description || "Present in class", critical: isCritical };
    } else if (eventType === "test_score_recorded") {
      payload = { score: parseFloat(score) || 0, note: description || "Test score updated", critical: isCritical };
    } else if (eventType === "activity_completed") {
      payload = { activity: description || "Extracurricular milestone completed", critical: isCritical };
    }

    const eventData = {
      child_id: user?.user_id || "S001",
      event_type: eventType,
      payload: payload
    };

    try {
      if (user) {
        await api.post("/events/", eventData);
      } else {
        // In demo simulation mode, simulate network call
        await new Promise((r) => setTimeout(r, 400));
      }

      setStatusMessage("Event successfully registered and queued for Digital Twin update!");
      setDescription("");
    } catch (err) {
      console.error("Submit event error:", err);
      setErrorMessage(err.response?.data?.detail || "Failed to submit event to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <h1>Submit Event</h1>
      <p>Log a new academic or system event manually into the Digital Twin.</p>

      {statusMessage && (
        <div style={{
          maxWidth: 760,
          background: "#ecfdf5",
          border: "1px solid #6ee7b7",
          color: "#065f46",
          padding: "14px 18px",
          borderRadius: 14,
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

      {errorMessage && (
        <div style={{
          maxWidth: 760,
          background: "#fef2f2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
          padding: "14px 18px",
          borderRadius: 14,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 14,
          fontWeight: 600
        }}>
          <AlertTriangle size={18} color="#ef4444" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Event Type</label>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="attendance_marked">Attendance Marked (attendance_marked)</option>
          <option value="test_score_recorded">Test Score Recorded (test_score_recorded)</option>
          <option value="activity_completed">Activity Completed (activity_completed)</option>
        </select>

        {eventType === "test_score_recorded" && (
          <>
            <label>Score (0 - 100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              style={{
                width: "100%",
                marginTop: 8,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </>
        )}

        <label>Value / Description</label>
        <textarea
          placeholder="Enter details associated with the event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={isCritical}
            onChange={(e) => setIsCritical(e.target.checked)}
          />
          Mark as critical priority
        </label>

        <div className="actions">
          <button
            type="button"
            className="ghost"
            style={{
              background: "transparent",
              border: "1px solid #e2e8f0",
              padding: "10px 18px",
              borderRadius: 10,
              cursor: "pointer",
            }}
            onClick={() => {
              setDescription("");
              setStatusMessage(null);
              setErrorMessage(null);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary"
            disabled={submitting}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          >
            <span>{submitting ? "Submitting..." : "Submit Event →"}</span>
            <Send size={16} />
          </button>
        </div>
      </form>

      <div className="help-box">
        <strong>Need Help?</strong>
        <p>
          Events submitted here are processed immediately by the Digital Twin engine.
          Ensure accuracy to prevent skewed risk insights.
        </p>
      </div>
    </div>
  );
}
