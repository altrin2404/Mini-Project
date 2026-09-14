import { Routes, Route } from "react-router-dom";
import Layout from "../../layouts/Layout";
import AdminDashboard from "./AdminDashboard";
import SystemHealth from "./SystemHealth";
import AuditLog from "./AuditLog";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="system-health" element={<SystemHealth />} />
        <Route path="audit-logs" element={<AuditLog />} />
        {/* Placeholder for other admin routes */}
        <Route path="*" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
