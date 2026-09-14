import { Routes, Route } from "react-router-dom";
import Layout from "../../layouts/Layout";
import TeacherDashboard from "./TeacherDashboard";
import ClassOverview from "./ClassOverview";
import RiskHub from "./RiskHub";
import TeacherProfile from "./TeacherProfile";

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ClassOverview />} />
        <Route path="students" element={<TeacherDashboard />} />
        <Route path="risk-hub" element={<RiskHub />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="*" element={<ClassOverview />} />
      </Route>
    </Routes>
  );
}
