import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Activity, Server, Clock, HardDrive, Wifi, ShieldAlert } from "lucide-react";
import "./adminDashboard.css";

export default function SystemHealth() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin/health").then(res => setHealth(res.data));
  }, []);

  if (!health) return <p style={{ padding: 40 }}>Loading system health...</p>;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Modular System Health Overview</h1>
        <p>Customize your dashboard with key system performance widgets.</p>
      </header>

      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="admin-card">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ background: '#dcfce7', color: '#10b981', padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
              ● All Systems Operational
            </div>
          </header>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="stat-widget">
               <Server size={24} color="#6366f1" />
               <h4>Backend Status</h4>
               <p style={{ fontSize: 24, fontWeight: 800 }}>Online</p>
               <span style={{ fontSize: 12, color: '#64748b' }}>Uptime: {health.uptime}</span>
            </div>
            <div className="stat-widget">
               <Activity size={24} color="#10b981" />
               <h4>API Response</h4>
               <p style={{ fontSize: 24, fontWeight: 800 }}>{health.api_response}ms</p>
               <span style={{ fontSize: 12, color: '#64748b' }}>P95: 120ms</span>
            </div>
            <div className="stat-widget">
               <HardDrive size={24} color="#a855f7" />
               <h4>Storage</h4>
               <p style={{ fontSize: 24, fontWeight: 800 }}>{health.storage_usage}%</p>
               <span style={{ fontSize: 12, color: '#64748b' }}>2.6TB used of 4TB</span>
            </div>
            <div className="stat-widget">
               <Wifi size={24} color="#f59e0b" />
               <h4>Latency</h4>
               <p style={{ fontSize: 24, fontWeight: 800 }}>{health.latency}ms</p>
               <span style={{ fontSize: 12, color: '#64748b' }}>Avg. ping to data center</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
           <header style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <ShieldAlert size={24} color="#ef4444" />
              <h3>Error Tracking</h3>
           </header>
           <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 48, fontWeight: 800, color: '#ef4444' }}>{health.error_rate}%</p>
              <p style={{ color: '#64748b' }}>Current Error Rate</p>
           </div>
           <button className="export-btn">View Detailed Logs</button>
        </div>
      </div>
    </div>
  );
}
