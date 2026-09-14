import { useEffect, useState } from "react";
import api from "../../api/axios";
import { AlertCircle, TrendingUp, Users, Layout } from "lucide-react";
import { Bar } from "react-chartjs-2";
import "./teacherDashboard.css";

export default function RiskHub() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then(res => setData(res.data)); // Reusing admin stats for now
  }, []);

  if (!data) return <p style={{ padding: 40 }}>Loading risk hub...</p>;

  const riskDistData = {
    labels: ["High Risk", "Moderate Risk", "Low Risk", "No Risk"],
    datasets: [{
      data: [4, 7, 12, 5],
      backgroundColor: ["#fee2e2", "#ffedd5", "#dcfce7", "#f1f5f9"],
      borderColor: ["#ef4444", "#f59e0b", "#10b981", "#94a3b8"],
      borderWidth: 1,
      borderRadius: 8
    }]
  };

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <h1>Action-Oriented Risk Hub</h1>
        <p>Immediate insights for proactive interventions.</p>
      </header>

      <div className="admin-grid" style={{ marginBottom: 40 }}>
         <div className="admin-card" style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 700 }}>AK</div>
            <h3>Alex Kim</h3>
            <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 700 }}>High Risk</p>
            <button style={{ marginTop: 12, border: '1px solid #ef4444', color: '#ef4444', background: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>Review Behavior</button>
         </div>
         <div className="admin-card" style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ffedd5', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 700 }}>MP</div>
            <h3>Maria Perez</h3>
            <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700 }}>Moderate Risk</p>
            <button style={{ marginTop: 12, border: '1px solid #f59e0b', color: '#f59e0b', background: 'none', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>Check Attendance</button>
         </div>
      </div>

      <div className="admin-card">
         <h3>Class-wise Risk Distribution</h3>
         <div style={{ height: 300, marginTop: 20 }}>
            <Bar data={riskDistData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
         </div>
      </div>
    </div>
  );
}
