import { useState } from "react";
import { useSim } from "../../simulations/SimulationContext";
import {
  Search,
  ListFilter,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Edit3,
  RotateCcw,
  BookOpen,
  Calendar,
  X,
  Save,
  Check,
  UserCheck
} from "lucide-react";
import "./teacherDashboard.css";

export default function TeacherDashboard() {
  const { activeTeacher, updateStudentMarks, scheduleImprovementExam } = useSim();
  const students = activeTeacher?.students || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [editingStudent, setEditingStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Mark entry form state
  const [editForm, setEditForm] = useState({ iat1: 0, iat2: 0, modelPractical: 0 });

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditForm({
      iat1: student.iat1,
      iat2: student.iat2,
      modelPractical: student.modelPractical,
    });
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudentMarks(editingStudent.id, {
      iat1: parseInt(editForm.iat1, 10),
      iat2: parseInt(editForm.iat2, 10),
      modelPractical: parseInt(editForm.modelPractical, 10),
    });

    setToastMessage(`✅ Marks updated for ${editingStudent.name}! Digital Twin recalculated.`);
    setEditingStudent(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRetestTrigger = (studentId, studentName) => {
    scheduleImprovementExam(studentId);
    setToastMessage(`🔄 Improvement Exam scheduled for ${studentName}. Automated alert sent to student & parent.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter students
  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === "all" || st.risk.toLowerCase() === filterRisk.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="teacher-page animate-fade-in-up">
      {/* SUCCESS TOAST */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 28,
          background: "#0f172a",
          color: "white",
          padding: "14px 22px",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 14,
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          borderLeft: "4px solid #10b981",
          zIndex: 9999,
        }}>
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className="teacher-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ background: "#e0e7ff", color: "#4f46e5", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                FACULTY PORTAL (RBAC)
              </span>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{activeTeacher.classBatch}</span>
            </div>
            <h1>Student Marks Entry & Evaluation Hub</h1>
            <p>Enter continuous assessment marks (IAT 1, IAT 2, Model Lab) and schedule Improvement Exams.</p>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-bar-container" style={{ flex: 1, minWidth: 260 }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setFilterRisk("all")}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                background: filterRisk === "all" ? "#6366f1" : "#f1f5f9",
                color: filterRisk === "all" ? "white" : "#64748b",
              }}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilterRisk("high")}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                background: filterRisk === "high" ? "#ef4444" : "#f1f5f9",
                color: filterRisk === "high" ? "white" : "#64748b",
              }}
            >
              High Risk
            </button>
            <button
              onClick={() => setFilterRisk("moderate")}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                background: filterRisk === "moderate" ? "#f59e0b" : "#f1f5f9",
                color: filterRisk === "moderate" ? "white" : "#64748b",
              }}
            >
              Moderate
            </button>
            <button
              onClick={() => setFilterRisk("low")}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                background: filterRisk === "low" ? "#10b981" : "#f1f5f9",
                color: filterRisk === "low" ? "white" : "#64748b",
              }}
            >
              Safe / Distinction
            </button>
          </div>
        </div>
      </header>

      {/* STUDENT MARKS TABLE CARD */}
      <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow-sm)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #e2e8f0", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "12px 16px" }}>Student Details</th>
              <th style={{ padding: "12px 16px" }}>Attendance (75% Cutoff)</th>
              <th style={{ padding: "12px 16px" }}>IAT 1 Marks</th>
              <th style={{ padding: "12px 16px" }}>IAT 2 Marks</th>
              <th style={{ padding: "12px 16px" }}>Model Practical</th>
              <th style={{ padding: "12px 16px" }}>Risk Level</th>
              <th style={{ padding: "12px 16px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(st => {
              const iat1Fail = st.iat1 < 50;
              const iat2Fail = st.iat2 < 50;
              const attRisk = st.attendance < 75;

              return (
                <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}>
                  {/* Name & Roll No */}
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: st.risk === "High" ? "#fee2e2" : st.risk === "Moderate" ? "#fef3c7" : "#dcfce7",
                        color: st.risk === "High" ? "#ef4444" : st.risk === "Moderate" ? "#d97706" : "#15803d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 12,
                      }}>
                        {st.initials}
                      </div>
                      <div>
                        <strong style={{ display: "block", color: "var(--text-main)", fontSize: 14 }}>{st.name}</strong>
                        <span style={{ color: "#64748b", fontSize: 11 }}>{st.rollNo} • {st.status}</span>
                      </div>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      fontWeight: 700,
                      color: attRisk ? "#ef4444" : "#10b981",
                      background: attRisk ? "#fee2e2" : "#ecfdf5",
                      padding: "4px 8px",
                      borderRadius: 8,
                    }}>
                      {st.attendance}% {attRisk ? "⚠️ Deficit" : "✅ Safe"}
                    </span>
                  </td>

                  {/* IAT 1 */}
                  <td style={{ padding: "16px" }}>
                    <span style={{ fontWeight: 800, color: iat1Fail ? "#ef4444" : "#10b981" }}>
                      {st.iat1}/100
                    </span>
                    {iat1Fail && <span style={{ display: "block", fontSize: 10, color: "#ef4444", fontWeight: 700 }}>Fail (&lt; 50%)</span>}
                  </td>

                  {/* IAT 2 */}
                  <td style={{ padding: "16px" }}>
                    <span style={{ fontWeight: 800, color: iat2Fail ? "#ef4444" : "#10b981" }}>
                      {st.iat2}/100
                    </span>
                    {iat2Fail && <span style={{ display: "block", fontSize: 10, color: "#ef4444", fontWeight: 700 }}>Fail (&lt; 50%)</span>}
                  </td>

                  {/* Model Practical */}
                  <td style={{ padding: "16px" }}>
                    <strong style={{ color: "#6366f1" }}>{st.modelPractical}/100</strong>
                  </td>

                  {/* Risk Badge */}
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 800,
                      background: st.risk === "High" ? "#fee2e2" : st.risk === "Moderate" ? "#fef3c7" : "#dcfce7",
                      color: st.risk === "High" ? "#ef4444" : st.risk === "Moderate" ? "#d97706" : "#15803d",
                    }}>
                      {st.risk}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={() => openEditModal(st)}
                        style={{
                          background: "#6366f1",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Edit3 size={13} /> Enter Marks
                      </button>

                      {(iat1Fail || iat2Fail) && (
                        <button
                          onClick={() => handleRetestTrigger(st.id, st.name)}
                          style={{
                            background: st.hasImprovement ? "#f1f5f9" : "#ffedd5",
                            color: st.hasImprovement ? "#64748b" : "#ea580c",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: st.hasImprovement ? "default" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                          disabled={st.hasImprovement}
                        >
                          <RotateCcw size={13} />
                          {st.hasImprovement ? "Retest Scheduled" : "Schedule Retest"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── INTERACTIVE MARK ENTRY MODAL ── */}
      {editingStudent && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{
            background: "white",
            borderRadius: 24,
            padding: 32,
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            position: "relative",
          }}>
            <button
              onClick={() => setEditingStudent(null)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#e0e7ff", color: "#6366f1", padding: 10, borderRadius: 12 }}>
                <Edit3 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Enter Marks: {editingStudent.name}</h3>
                <span style={{ fontSize: 12, color: "#64748b" }}>Roll No: {editingStudent.rollNo} • {activeTeacher.subject}</span>
              </div>
            </div>

            <form onSubmit={handleSaveMarks} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--text-main)" }}>
                  Internal Exam 1 (IAT 1) Score (out of 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.iat1}
                  onChange={(e) => setEditForm(prev => ({ ...prev, iat1: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 15, fontWeight: 700 }}
                  required
                />
                <span style={{ fontSize: 11, color: editForm.iat1 < 50 ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                  {editForm.iat1 < 50 ? "⚠️ Below 50% - Requires Improvement Exam 1" : "✅ Passing Cutoff Met"}
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--text-main)" }}>
                  Internal Exam 2 (IAT 2) Score (out of 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.iat2}
                  onChange={(e) => setEditForm(prev => ({ ...prev, iat2: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 15, fontWeight: 700 }}
                  required
                />
                <span style={{ fontSize: 11, color: editForm.iat2 < 50 ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                  {editForm.iat2 < 50 ? "⚠️ Below 50% - Requires Improvement Exam 2" : "✅ Passing Cutoff Met"}
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--text-main)" }}>
                  Model Practical Examination Score (out of 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.modelPractical}
                  onChange={(e) => setEditForm(prev => ({ ...prev, modelPractical: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 15, fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background: "#6366f1",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Save size={16} /> Save & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
