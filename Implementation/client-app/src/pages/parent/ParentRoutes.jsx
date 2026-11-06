import { Routes, Route } from "react-router-dom";
import Layout from "../../layouts/Layout";
import ParentDashboard from "./ParentDashboard";
import ChildTwin from "./ChildTwin";
import AcademicReports from "./AcademicReports";

export default function ParentRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ParentDashboard />} />
        <Route path="digital-twin" element={<ChildTwin />} />
        <Route path="reports" element={<AcademicReports />} />
        {/* Placeholder for other parent routes */}
        <Route path="*" element={<ParentDashboard />} />
      </Route>
    </Routes>
  );
}
