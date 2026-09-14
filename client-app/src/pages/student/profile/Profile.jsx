import { User, Shield, MapPin, Mail, Phone, ChevronRight } from "lucide-react";
import "./profile.css";

export default function Profile({ user }) {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account details and preferences.</p>
      </header>

      <section className="profile-hero">
        <div className="avatar-large">👨‍🎓</div>
        <div className="hero-info">
          <h2>{user?.name || "Student User"}</h2>
          <p>Computer Science Department</p>
          <span className="role-tag">STUDENT</span>
        </div>
        <button className="btn-edit">Edit Profile</button>
      </section>

      <div className="profile-grid">
        <section className="profile-card">
          <h3>Personal Information</h3>
          
          <div className="input-row">
            <label>Full Name</label>
            <input type="text" value={user?.name || "Student User"} disabled />
          </div>

          <div className="input-row">
            <label>Email Address</label>
            <input type="email" value={user?.email || "student@test.com"} disabled />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div className="input-row">
               <label>Phone Number</label>
               <input type="text" value="+1 (555) 000-0000" disabled />
             </div>
             <div className="input-row">
                <label>Location</label>
                <input type="text" value="Campus Dorm A" disabled />
             </div>
          </div>
        </section>

        <section className="profile-card">
          <h3>Account Security</h3>
          
          <div className="security-item">
            <span>Change Password</span>
            <ChevronRight size={16} />
          </div>

          <div className="security-item">
            <span>Two-Factor Auth</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Enabled</span>
          </div>

          <div className="security-item">
            <span>Active Sessions</span>
            <span style={{ color: 'var(--text-muted)' }}>2 Devices</span>
          </div>

          <div className="log-footer">
            Recent Login: Today, 09:41 AM (IP: 192.168.1.1)
          </div>
        </section>
      </div>
      
      <p style={{ marginTop: 40, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
         Your profile information is securely stored and used only for Digital Twin verification purposes.
      </p>
    </div>
  );
}
