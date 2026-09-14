import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, GraduationCap, BarChart3, AlertCircle } from "lucide-react";
import "./teacherDashboard.css";

export default function ClassOverview() {
  const [summary, setSummary] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/dashboard/teacher/summary")
      .then(res => setSummary(res.data))
      .catch(err => {
        console.error("Teacher Summary Error:", err);
        setError("Failed to load class overview.");
      });
  }, []);

  if (error) return <div className="teacher-page"><p className="error-text">{error}</p></div>;
  if (!summary) return <p className="loading-text">Loading class overview...</p>;

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <h1>Teacher Dashboard: Class Overview</h1>
        <p>Priorities and insights for proactive intervention in your class.</p>
      </header>

      <div className="admin-grid" style={{ marginBottom: 40 }}>
         <div className="stat-widget" style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#6366f1' }}>{summary.total_students}</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Total Students</p>
         </div>
         <div className="stat-widget" style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>{summary.engagement}%</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Avg. Engagement</p>
         </div>
         <div className="stat-widget" style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6' }}>{summary.attendance}%</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Avg. Attendance</p>
         </div>
         <div className="stat-widget" style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#ef4444' }}>{summary.alerts}</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Recent Alerts</p>
         </div>
      </div>

      <div className="admin-card">
         <div className="section-header">
            <AlertCircle color="#ef4444" size={24} />
            <h2>At-Risk Students</h2>
         </div>
         <p className="section-desc">Students identified as needing immediate attention based on recent data.</p>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {summary.at_risk.map((student, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#f8fafc', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <span style={{ fontWeight: 600 }}>{student.name}</span>
                  </div>
                  <span style={{ 
                     padding: '4px 12px', 
                     borderRadius: 20, 
                     fontSize: 12, 
                     fontWeight: 700,
                     background: student.risk === 'High' ? '#fee2e2' : '#ffedd5',
                     color: student.risk === 'High' ? '#ef4444' : '#f59e0b'
                  }}>
                     {student.risk} Risk
                  </span>
               </div>
            ))}
         </div>
         <button className="export-btn" style={{ marginTop: 24, background: '#6366f1', color: 'white' }}>View All Students</button>
      </div>
    </div>
  );
}
