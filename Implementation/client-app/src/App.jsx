import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentRoutes from "./pages/student/StudentRoutes";
import TeacherRoutes from "./pages/teacher/TeacherRoutes";
import ParentRoutes from "./pages/parent/ParentRoutes";
import SimSwitcher from "./components/common/SimSwitcher";
import "./utils/chartSetup";

import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <p style={{ color: "#64748b", fontWeight: 600 }}>Loading Digital Twin Environment...</p>
      </div>
    );
  }

  // ── UNAUTHENTICATED: MUST GO TO LOGIN ──
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ── AUTHENTICATED ROUTES (RBAC PROTECTED) ──
  return (
    <>
      <Routes>
        {/* Once signed in, redirect /login to home */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {user.role === "student" && <Route path="/*" element={<StudentRoutes />} />}
        {user.role === "teacher" && <Route path="/*" element={<TeacherRoutes />} />}
        {user.role === "parent"  && <Route path="/*" element={<ParentRoutes />} />}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Persona Switcher for Presentation Viva */}
      <SimSwitcher />
    </>
  );
}
