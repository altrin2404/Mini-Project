import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useSim } from "../../simulations/SimulationContext";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { X, LogOut } from "lucide-react";
import "./sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const {
    activeRole, setActiveRole,
    studentIdx, setStudentIdx,
    parentIdx,  setParentIdx,
    teacherIdx, setTeacherIdx,
    activeStudent, activeParent, activeTeacher,
    studentProfiles, parentProfiles, teacherProfiles,
  } = useSim();

  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  // In demo mode, derive alert count and demoName from simulation data
  const effectiveRole = user?.role || activeRole;

  useEffect(() => {
    if (user?.role === 'student' || user?.role === 'parent') {
      api.get("/alerts/self")
        .then(res => setAlertCount(res.data?.length || 0))
        .catch(() => setAlertCount(0));
    }
    // In demo mode, count alerts from simulation
    if (!user && activeRole === 'student') {
      const a = activeStudent?.alerts;
      setAlertCount((a?.critical ? 1 : 0) + (a?.items?.length || 0));
    }
  }, [user, activeRole, activeStudent]);

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate("/login", { replace: true });
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const renderLinks = () => {
    switch (effectiveRole) {
      case 'student':
        return (
          <>
            <NavLink end to="" className="nav-link" onClick={handleNavClick}>Overview</NavLink>
            <NavLink to="twin" className="nav-link" onClick={handleNavClick}>Academic Journey</NavLink>
            <NavLink to="rewards" className="nav-link" onClick={handleNavClick}>Badges & Rewards</NavLink>
            <NavLink to="risk" className="nav-link" onClick={handleNavClick}>AI Study Advice</NavLink>
            <NavLink to="alerts" className="nav-link" onClick={handleNavClick}>
              Alerts
              {alertCount > 0 && <span className="badge">{alertCount}</span>}
            </NavLink>
            <NavLink to="events" className="nav-link" onClick={handleNavClick}>Achievements & Participation</NavLink>
            <NavLink to="profile" className="nav-link" onClick={handleNavClick}>My Profile</NavLink>
          </>
        );
      case 'teacher':
        return (
          <>
            <NavLink end to="" className="nav-link" onClick={handleNavClick}>Class Overview</NavLink>
            <NavLink to="students" className="nav-link" onClick={handleNavClick}>Enter Marks & Students</NavLink>
            <NavLink to="bulk-upload" className="nav-link" onClick={handleNavClick}>Upload Marks Sheet</NavLink>
            <NavLink to="benchmarks" className="nav-link" onClick={handleNavClick}>AI Accuracy & Stats</NavLink>
            <NavLink to="risk-hub" className="nav-link" onClick={handleNavClick}>Students Needing Help</NavLink>
            <NavLink to="profile" className="nav-link" onClick={handleNavClick}>Profile</NavLink>
          </>
        );
      case 'parent':
        return (
          <>
            <NavLink end to="" className="nav-link" onClick={handleNavClick}>Parent Overview</NavLink>
            <NavLink to="digital-twin" className="nav-link" onClick={handleNavClick}>Child Academic Health</NavLink>
            <NavLink to="reports" className="nav-link" onClick={handleNavClick}>Term Grade Reports</NavLink>
            <NavLink to="profile" className="nav-link" onClick={handleNavClick}>Parent Profile</NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <div className="brand animate-fade-in-up">
          <div className="brand-info">
            <div className="logo">SX</div>
            <div>
              <h3>Student Portal</h3>
              <span>Academic Platform</span>
            </div>
          </div>
          {onClose && (
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Demo mode identity strip */}
        {!user && (
          <div style={{
            padding: "10px 14px",
            marginBottom: 20,
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--primary-dark)",
            fontWeight: 700,
          }}>
            🧪 Demo Active
          </div>
        )}

        <div className="nav-group animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {renderLinks()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", animationDelay: "0.2s", marginTop: 24 }} className="animate-fade-in-up">
        {/* Dropdown for simulation profiling */}
        {!user && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: "var(--text-light)", letterSpacing: "0.05em" }}>SIMULATION PROFILE</label>
            <select
              value={activeRole === "student" ? `student-${studentIdx}` : activeRole === "teacher" ? `teacher-${teacherIdx}` : activeRole === "parent" ? `parent-${parentIdx}` : "admin-0"}
              onChange={(e) => {
                const [role, idxStr] = e.target.value.split("-");
                const idx = parseInt(idxStr, 10);
                setActiveRole(role);
                if (role === "student") {
                  setStudentIdx(idx);
                } else if (role === "teacher") {
                  setTeacherIdx(idx);
                } else if (role === "parent") {
                  setParentIdx(idx);
                }
                if (onClose) onClose();
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1.5px solid var(--border)",
                background: "white",
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--text-main)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <optgroup label="👩‍🎓 Students">
                {studentProfiles.map((p, i) => (
                  <option key={`s-${i}`} value={`student-${i}`}>
                    {p.name} ({p.tag})
                  </option>
                ))}
              </optgroup>
              <optgroup label="👩‍🏫 Faculty Mentors">
                {teacherProfiles.map((t, i) => (
                  <option key={`t-${i}`} value={`teacher-${i}`}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="👨‍👩‍👧 Parents">
                {parentProfiles.map((p, i) => (
                  <option key={`p-${i}`} value={`parent-${i}`}>
                    {p.childName}'s Parent
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          <span>{user ? "Sign Out" : "Exit Session"}</span>
        </button>
      </div>
    </aside>
  );
}
