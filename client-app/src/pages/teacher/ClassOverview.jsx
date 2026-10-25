import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useSim } from "../../simulations/SimulationContext";
import { Users, GraduationCap, BarChart3, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";
import AlertDispatcherModal from "../../components/common/AlertDispatcherModal";
import "./teacherDashboard.css";

export default function ClassOverview() {
  const navigate = useNavigate();
  const { activeTeacher } = useSim();
  const [summary, setSummary] = useState(null);
  const [alertingStudent, setAlertingStudent] = useState(null);

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

      {/* Institutional Metric Summary */}
      <div className="faculty-grid">
         <div className="faculty-stat-card">
            <p className="faculty-stat-val" style={{ color: '#1e3a8a' }}>{summary.total_students}</p>
            <p className="faculty-stat-lbl">Total Enrolled Students</p>
         </div>
         <div className="faculty-stat-card">
            <p className="faculty-stat-val" style={{ color: '#0d9488' }}>{summary.engagement}%</p>
            <p className="faculty-stat-lbl">Class Average Engagement</p>
         </div>
         <div className="faculty-stat-card">
            <p className="faculty-stat-val" style={{ color: '#2563eb' }}>{summary.attendance}%</p>
            <p className="faculty-stat-lbl">Biometric Attendance Avg.</p>
         </div>
         <div className="faculty-stat-card">
            <p className="faculty-stat-val" style={{ color: '#e11d48' }}>{summary.alerts}</p>
            <p className="faculty-stat-lbl">Students Flagged For Attention</p>
         </div>
      </div>

      <div className="faculty-card">
         <div className="section-header">
            <AlertCircle color="#e11d48" size={22} />
            <h2>Students Flagged for Immediate Attention</h2>
         </div>
         <p className="section-desc">Students identified with attendance deficits or internal exam marks below cutoff (&lt; 50%).</p>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {summary.at_risk.map((student, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                     <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div>
                       <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{student.name}</span>
                       {student.reason && <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "#64748b" }}>{student.reason}</p>}
                     </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ 
                       padding: '4px 10px', 
                       borderRadius: 6, 
                       fontSize: 11, 
                       fontWeight: 700,
                       background: student.risk === 'High' ? '#fee2e2' : '#ffedd5',
                       color: student.risk === 'High' ? '#b91c1c' : '#b45309'
                    }}>
                       {student.risk} Risk
                    </span>
                    <button
                      onClick={() => setAlertingStudent({ name: student.name, risk: student.risk, reason: student.reason })}
                      style={{
                        padding: "6px 12px",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        border: "1px solid #fca5a5",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      <ShieldAlert size={13} /> Notify Parent
                    </button>
                  </div>
               </div>
            ))}
         </div>
         <button
           className="export-btn"
           onClick={() => navigate("students")}
           style={{ marginTop: 24, background: '#1e3a8a', color: 'white', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
         >
           View Class Marks Register & Schedule Retests →
         </button>
      </div>

      {/* Faculty Parent Advisory Dispatcher Modal */}
      {alertingStudent && (
        <AlertDispatcherModal
          isOpen={Boolean(alertingStudent)}
          onClose={() => setAlertingStudent(null)}
          student={alertingStudent}
        />
      )}
    </div>
  );
}
