import { useState } from "react";
import { useSim } from "../../simulations/SimulationContext";
import { ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import "./SimSwitcher.css";

export default function SimSwitcher() {
  const {
    activeRole, setActiveRole,
    studentIdx, setStudentIdx,
    parentIdx,  setParentIdx,
    teacherIdx, setTeacherIdx,
    activeStudent, activeParent, activeTeacher,
    studentProfiles, parentProfiles, teacherProfiles,
  } = useSim();

  const [open, setOpen] = useState(false);

  const current =
    activeRole === "student"
      ? activeStudent
      : activeRole === "teacher"
      ? activeTeacher
      : activeParent;


  return (
    <div className={`sim-switcher ${open ? "sim-open" : ""}`}>
      {/* TOGGLE BUTTON */}
      <button className="sim-toggle" onClick={() => setOpen(o => !o)}>
        <FlaskConical size={18} />
        <span>Demo RBAC Switcher</span>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {open && (
        <div className="sim-panel">
          <p className="sim-title">Select User Role (Access Control Demo)</p>

          {/* Role Tabs */}
          <div className="sim-role-tabs" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            <button
              className={`sim-role-btn ${activeRole === "student" ? "active" : ""}`}
              onClick={() => setActiveRole("student")}
            >
              Student
            </button>
            <button
              className={`sim-role-btn ${activeRole === "teacher" ? "active" : ""}`}
              onClick={() => setActiveRole("teacher")}
            >
              Faculty
            </button>
            <button
              className={`sim-role-btn ${activeRole === "parent" ? "active" : ""}`}
              onClick={() => setActiveRole("parent")}
            >
              Parent
            </button>
          </div>


          {/* Profile List */}
          <div className="sim-profile-list">
            {activeRole === "student" &&
              studentProfiles.map((p, i) => (
                <button
                  key={p.id}
                  className={`sim-profile-btn ${studentIdx === i ? "selected" : ""}`}
                  onClick={() => setStudentIdx(i)}
                >
                  <span className="sim-profile-name">{p.name}</span>
                  <span className="sim-tag" style={{ background: p.tagColor + "22", color: p.tagColor }}>
                    {p.tag}
                  </span>
                </button>
              ))}

            {activeRole === "teacher" &&
              teacherProfiles.map((t, i) => (
                <button
                  key={t.id}
                  className={`sim-profile-btn ${teacherIdx === i ? "selected" : ""}`}
                  onClick={() => setTeacherIdx(i)}
                >
                  <span className="sim-profile-name">{t.name}</span>
                  <span className="sim-tag" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
                    {t.subject.split(" ")[0]} Mentor
                  </span>
                </button>
              ))}

            {activeRole === "parent" &&
              parentProfiles.map((p, i) => (
                <button
                  key={p.id}
                  className={`sim-profile-btn ${parentIdx === i ? "selected" : ""}`}
                  onClick={() => setParentIdx(i)}
                >
                  <span className="sim-profile-name">{p.childName}'s Parent</span>
                  <span className="sim-tag" style={{ background: p.tagColor + "22", color: p.tagColor }}>
                    {p.tag}
                  </span>
                </button>
              ))}
          </div>


          <div className="sim-footer">
            <span className="sim-active-label">
              Active: <strong>{current?.name || current?.childName}</strong> ({activeRole.toUpperCase()})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
