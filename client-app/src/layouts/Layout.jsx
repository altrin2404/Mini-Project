import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../auth/AuthContext";
import { useSim } from "../simulations/SimulationContext";
import api from "../api/axios";
import {
  Menu,
  LayoutDashboard,
  Cpu,
  Award,
  Sparkles,
  Bell,
  User,
  Users,
  AlertTriangle,
  FileText,
  Activity,
  Layers
} from "lucide-react";
import "./layout.css";

export default function Layout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user } = useAuth();
  const { activeRole, activeStudent, activeTeacher, activeParent } = useSim();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);

  const effectiveRole = user?.role || activeRole;

  // Auto-close mobile drawer on route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Fetch alert count for bottom nav badge
  useEffect(() => {
    if (user?.role === 'student' || user?.role === 'parent') {
      api.get("/alerts/self")
        .then(res => setAlertCount(res.data?.length || 0))
        .catch(() => setAlertCount(0));
    }
    if (!user && activeRole === 'student') {
      const a = activeStudent?.alerts;
      setAlertCount((a?.critical ? 1 : 0) + (a?.items?.length || 0));
    }
  }, [user, activeRole, activeStudent]);

  // Role display label
  const roleLabel =
    effectiveRole === "student"
      ? (activeStudent?.name ? activeStudent.name.split(" ")[0] : "Student")
      : effectiveRole === "teacher"
      ? (activeTeacher?.name ? activeTeacher.name.split(" ")[0] : "Faculty")
      : effectiveRole === "parent"
      ? "Parent"
      : "Admin";

  const renderBottomNav = () => {
    switch (effectiveRole) {
      case "student":
        return (
          <nav className="mobile-bottom-nav">
            <NavLink end to="" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <LayoutDashboard size={18} />
              </div>
              <span>Home</span>
            </NavLink>
            <NavLink to="twin" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Cpu size={18} />
              </div>
              <span>Twin</span>
            </NavLink>
            <NavLink to="rewards" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Award size={18} />
              </div>
              <span>Badges</span>
            </NavLink>
            <NavLink to="risk" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Sparkles size={18} />
              </div>
              <span>Insights</span>
            </NavLink>
            <NavLink to="alerts" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Bell size={18} />
                {alertCount > 0 && <span className="bottom-nav-badge">{alertCount}</span>}
              </div>
              <span>Alerts</span>
            </NavLink>
          </nav>
        );

      case "teacher":
        return (
          <nav className="mobile-bottom-nav">
            <NavLink end to="" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <LayoutDashboard size={18} />
              </div>
              <span>Overview</span>
            </NavLink>
            <NavLink to="students" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Users size={18} />
              </div>
              <span>Students</span>
            </NavLink>
            <NavLink to="risk-hub" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <AlertTriangle size={18} />
              </div>
              <span>Risk Hub</span>
            </NavLink>
            <NavLink to="profile" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <User size={18} />
              </div>
              <span>Profile</span>
            </NavLink>
          </nav>
        );

      case "parent":
        return (
          <nav className="mobile-bottom-nav">
            <NavLink end to="" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <LayoutDashboard size={18} />
              </div>
              <span>Home</span>
            </NavLink>
            <NavLink to="digital-twin" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Cpu size={18} />
              </div>
              <span>Twin</span>
            </NavLink>
            <NavLink to="reports" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <FileText size={18} />
              </div>
              <span>Reports</span>
            </NavLink>
            <NavLink to="profile" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <User size={18} />
              </div>
              <span>Profile</span>
            </NavLink>
          </nav>
        );

      case "admin":
        return (
          <nav className="mobile-bottom-nav">
            <NavLink end to="" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <LayoutDashboard size={18} />
              </div>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="system-health" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Activity size={18} />
              </div>
              <span>Health</span>
            </NavLink>
            <NavLink to="audit-logs" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <Layers size={18} />
              </div>
              <span>Audit</span>
            </NavLink>
            <NavLink to="profile" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <User size={18} />
              </div>
              <span>Profile</span>
            </NavLink>
          </nav>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-layout-container">
      {/* Mobile Top Bar */}
      <header className="mobile-top-bar">
        <div className="mobile-bar-left">
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <div className="mobile-brand-title">
            <div className="mobile-brand-logo">DT</div>
            <div className="mobile-brand-text">
              <h2>Digital Twin</h2>
              <span>Academic AI</span>
            </div>
          </div>
        </div>

        <div className="mobile-bar-right">
          <span className="mobile-role-pill">
            {effectiveRole === "student" ? "👩‍🎓" : effectiveRole === "teacher" ? "👩‍🏫" : effectiveRole === "parent" ? "👨‍👩‍👧" : "🛡️"} {roleLabel}
          </span>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${isMobileNavOpen ? "active" : ""}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      {renderBottomNav()}
    </div>
  );
}
