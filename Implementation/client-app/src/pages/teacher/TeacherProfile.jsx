import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { User, Settings, Clock, BookOpen, LogOut } from "lucide-react";
import "./teacherDashboard.css";

export default function TeacherProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <h1>Teacher Profile</h1>
        <p>Manage your account and view your teaching assignments.</p>
      </header>

      <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 40 }}>
         <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>
            JD
         </div>
         <div>
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>Jane Doe</h2>
            <p style={{ color: '#64748b' }}>Math & Science Teacher</p>
            <p style={{ color: '#64748b' }}>{user?.email || 'jane.doe@example.com'}</p>
         </div>
      </div>

      <div className="admin-grid" style={{ marginTop: 32 }}>
         <div className="admin-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <BookOpen size={20} color="#6366f1" /> Assigned Classes
            </h3>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
               {['Algebra I (Grade 9)', 'Biology (Grade 10)', 'Geometry (Grade 9)'].map((cls, i) => (
                  <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span>{cls}</span>
                     <span style={{ fontSize: 12, color: '#64748b' }}>Period {i+1}</span>
                  </div>
               ))}
            </div>
            <button className="export-btn" style={{ marginTop: 20 }}>Request Class Change</button>
         </div>

         <div className="admin-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <Settings size={20} color="#6366f1" /> Account Settings
            </h3>
            <p style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>Security, Notifications, and Preferences.</p>
            <button 
               onClick={handleLogout}
               style={{ width: '100%', marginTop: 60, background: '#ef4444', color: 'white', border: 'none', padding: 16, borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
               <LogOut size={20} /> Logout
            </button>
         </div>
      </div>
    </div>
  );
}
