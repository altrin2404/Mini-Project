import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 0, height: "100vh", overflow: "hidden", position: "relative" }}>
        <Outlet />
      </main>
    </div>
  );
}
