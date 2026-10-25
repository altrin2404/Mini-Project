import { Routes, Route } from "react-router-dom";
import Layout from "../../layouts/Layout";
import TeacherDashboard from "./TeacherDashboard";
import ClassOverview from "./ClassOverview";
import RiskHub from "./RiskHub";
import TeacherProfile from "./TeacherProfile";
import BulkUpload from "./BulkUpload";
import ModelBenchmarks from "./ModelBenchmarks";

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ClassOverview />} />
        <Route path="students" element={<TeacherDashboard />} />
        <Route path="bulk-upload" element={<BulkUpload />} />
        <Route path="benchmarks" element={<ModelBenchmarks />} />
        <Route path="risk-hub" element={<RiskHub />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="*" element={<ClassOverview />} />
      </Route>
    </Routes>
  );
}
