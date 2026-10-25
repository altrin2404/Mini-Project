import { useState } from "react";
import { MessageSquare, Mail, Send, CheckCircle2, AlertTriangle, X, ShieldAlert, PhoneCall } from "lucide-react";

export default function AlertDispatcherModal({ isOpen, onClose, student, alert }) {
  if (!isOpen || !student) return null;

  const [channel, setChannel] = useState("whatsapp");
  const [parentPhone, setParentPhone] = useState(student.parentPhone || "+91 98402 12345");
  const [parentEmail, setParentEmail] = useState(student.parentEmail || `${student.name.toLowerCase().replace(/\s+/g, "")}.parent@sxcce.edu.in`);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const defaultMsg = `Dear Parent,\n\nThis is an automated academic advisory alert from St. Xavier's Catholic College of Engineering (Digital Class Twin Telemetry System).\n\nStudent: ${student.name} (Reg No: ${student.regNo || "962223205010"})\nDigital Twin Status: ${student.risk?.riskLevel || "Warning"} Risk\nAttendance: ${student.dashboard?.attendance || 68}%\nCurrent Projected CGPA: ${student.dashboard?.cgpa || 6.2}\n\nNotice: Student is currently falling below the 75% attendance/CIA threshold. Kindly review the corrective counseling intervention.\n\n- Department of Information Technology, SXCCE`;

  const [customMessage, setCustomMessage] = useState(defaultMsg);

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1800);
    }, 900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 580,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          animation: "fadeInScale 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            padding: "20px 24px",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={22} color="#f87171" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                Automated Parent Advisory Dispatcher
              </h3>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0 0" }}>
                Target: {student.name} • Living Twin Trigger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {sentSuccess ? (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <CheckCircle2 size={56} color="#10b981" style={{ margin: "0 auto 16px auto" }} />
              <h4 style={{ fontSize: 18, fontWeight: 700, color: "#065f46" }}>
                Notice Dispatched Successfully!
              </h4>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
                Delivery simulated via {channel === "whatsapp" ? "WhatsApp Gateway (+91)" : "Official College SMTP Mailer"}.
                Audit record stored in twin telemetry logs.
              </p>
            </div>
          ) : (
            <>
              {/* Channel Selector */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: channel === "whatsapp" ? "2px solid #25d366" : "1px solid #e2e8f0",
                    background: channel === "whatsapp" ? "#f0fdf4" : "#ffffff",
                    color: channel === "whatsapp" ? "#166534" : "#64748b",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <MessageSquare size={16} color="#25d366" />
                  WhatsApp Direct
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: channel === "email" ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    background: channel === "email" ? "#eff6ff" : "#ffffff",
                    color: channel === "email" ? "#1e40af" : "#64748b",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <Mail size={16} color="#2563eb" />
                  Official Email
                </button>
              </div>

              {/* Recipient Input */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  {channel === "whatsapp" ? "Parent WhatsApp Number" : "Parent Email Address"}
                </label>
                <input
                  type="text"
                  value={channel === "whatsapp" ? parentPhone : parentEmail}
                  onChange={(e) => (channel === "whatsapp" ? setParentPhone(e.target.value) : setParentEmail(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Message Draft */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Advisory Notification Draft (Auto-generated by Twin Engine)
                </label>
                <textarea
                  rows={6}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDispatch}
                  disabled={isSending}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: channel === "whatsapp" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: isSending ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Send size={15} />
                  {isSending ? "Dispatching Notice..." : `Send via ${channel === "whatsapp" ? "WhatsApp" : "Email"}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
