import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentRoutes from "./pages/student/StudentRoutes";
import TeacherRoutes from "./pages/teacher/TeacherRoutes";
import ParentRoutes from "./pages/parent/ParentRoutes";
import AdminRoutes from "./pages/admin/AdminRoutes";
import SimSwitcher from "./components/common/SimSwitcher";
import "./utils/chartSetup";

import { useAuth } from "./auth/AuthContext";
import { useSim } from "./simulations/SimulationContext";

export default function App() {
  const { user, loading } = useAuth();
  const { activeRole } = useSim();
  
  if (loading) return null;

  // ── DEMO / SIMULATION MODE (no real login needed) ──
  const isDemo = !user;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Simulation demo routes — bypass real auth */}
        {isDemo && activeRole === "student" && (
          <Route path="/*" element={<StudentRoutes />} />
        )}
        {isDemo && activeRole === "teacher" && (
          <Route path="/*" element={<TeacherRoutes />} />
        )}
        {isDemo && activeRole === "parent" && (
          <Route path="/*" element={<ParentRoutes />} />
        )}
        {isDemo && activeRole === "admin" && (
          <Route path="/*" element={<AdminRoutes />} />
        )}

        {/* Real authenticated routes */}
        {user?.role === 'student' && <Route path="/*" element={<StudentRoutes />} />}
        {user?.role === 'teacher' && <Route path="/*" element={<TeacherRoutes />} />}
        {user?.role === 'parent'  && <Route path="/*" element={<ParentRoutes />} />}
        {user?.role === 'admin'   && <Route path="/*" element={<AdminRoutes />} />}

        {/* Default: go to demo dashboard instead of login */}
        {isDemo && <Route path="*" element={<Navigate to="/" replace />} />}
        {user && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>

      {/* Floating RBAC & Persona Switcher for Presentation Demo */}
      {isDemo && <SimSwitcher />}
    </>
  );
}


