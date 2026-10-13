import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useSim } from "../../simulations/SimulationContext";
import { Users, GraduationCap, BarChart3, AlertCircle, ArrowRight } from "lucide-react";
import "./teacherDashboard.css";

export default function ClassOverview() {
  const navigate = useNavigate();
  const { activeTeacher } = useSim();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/dashboard/teacher/summary")
      .then(res => setSummary(res.data))
      .catch(() => {
        // Fallback to activeTeacher simulation data for seamless demo
        if (activeTeacher?.summary) {
          setSummary({
            total_students: activeTeacher.summary.totalStudents,
            engagement: 88,
            attendance: activeTeacher.summary.classAttendanceAvg,
            alerts: activeTeacher.summary.alertsCount,
            at_risk: activeTeacher.summary.atRiskStudents.map(s => ({
              name: s.name,
              risk: s.risk,
              reason: s.reason,
            })),
          });
        }
      });
  }, [activeTeacher]);

  if (!summary) return <p className="loading-text">Loading class overview...</p>;

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <h1>Faculty Dashboard: Class Overview</h1>
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
                     <div>
                       <span style={{ fontWeight: 700 }}>{student.name}</span>
                       {student.reason && <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "#64748b" }}>{student.reason}</p>}
                     </div>
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
         <button
           className="export-btn"
           onClick={() => navigate("students")}
           style={{ marginTop: 24, background: '#6366f1', color: 'white', display: 'inline-flex', alignItems: 'center', gap: 8 }}
         >
           View All Students & Enter Marks →
         </button>
      </div>
    </div>
  );
}
