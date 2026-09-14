import { Routes, Route } from "react-router-dom";
import Layout from "../../layouts/Layout";

import Dashboard from "./dashboard/Dashboard";
import DigitalTwin from "./twin/DigitalTwin";
import RiskInsights from "./risk/RiskInsights";
import Alerts from "./alerts/Alerts";
import SubmitEvent from "./events/SubmitEvent";
import Profile from "./profile/Profile";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="twin" element={<DigitalTwin />} />
        <Route path="risk" element={<RiskInsights />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="events" element={<SubmitEvent />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
