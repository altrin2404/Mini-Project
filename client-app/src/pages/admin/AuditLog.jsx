import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, Filter, Download, RotateCcw } from "lucide-react";
import "./adminDashboard.css";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/dashboard/admin/audit").then(res => setLogs(res.data.events));
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Events Audit Log</h1>
        <p>Detailed record of all system events for forensic investigation.</p>
        
        <div className="header-icons">
          <button className="icon-btn"><Download size={18} /> Export</button>
          <button className="icon-btn"><RotateCcw size={18} /></button>
        </div>
      </header>

      <div className="admin-card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search Event ID, Source System, or Type..." 
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 12, border: '1px solid #e2e8f0' }}
            />
          </div>
          <button style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0 20px', borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={18} /> Apply Filters
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13 }}>
              <th style={{ padding: '16px' }}>EVENT ID</th>
              <th style={{ padding: '16px' }}>TIMESTAMP</th>
              <th style={{ padding: '16px' }}>SOURCE</th>
              <th style={{ padding: '16px' }}>TYPE</th>
              <th style={{ padding: '16px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{log.id}</td>
                <td style={{ padding: '16px' }}>{log.timestamp}</td>
                <td style={{ padding: '16px' }}>{log.source}</td>
                <td style={{ padding: '16px' }}>{log.type}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: 20, 
                    fontSize: 12, 
                    fontWeight: 700,
                    background: log.status === 'Success' ? '#dcfce7' : log.status === 'Critical' ? '#fee2e2' : '#ffedd5',
                    color: log.status === 'Success' ? '#10b981' : log.status === 'Critical' ? '#ef4444' : '#f59e0b'
                  }}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
