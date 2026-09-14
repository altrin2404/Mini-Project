import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, ListFilter, ArrowUpDown, AlertCircle, AlertTriangle, CheckCircle, Info, MessageSquare } from "lucide-react";
import "./teacherDashboard.css";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/teacher").then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ padding: 40 }}>Loading students overview...</p>;

  const highRisk = data.students.filter(s => s.risk === "High");
  const moderateRisk = data.students.filter(s => s.risk === "Moderate");
  const lowRisk = data.students.filter(s => s.risk === "Low");

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <h1>Students Overview</h1>
        <p>Access and manage all students under your care.</p>

        <div className="search-bar-container">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search students by name or ID..." />
        </div>

        <div className="filter-row">
          <div className="filter-item"><ListFilter size={18} /> Filter</div>
          <div className="filter-item"><ArrowUpDown size={18} /> Sort</div>
        </div>
      </header>

      {/* High Risk Section */}
      <section className="risk-section">
        <div className="section-header">
          <AlertCircle className="icon-alert" size={24} />
          <h2>High Risk Students</h2>
        </div>
        <p className="section-desc">Students requiring immediate attention and intervention.</p>
        
        <div className="student-grid">
          {highRisk.map(student => (
            <div key={student.id} className="student-card">
              <div className="initials-circle high">{student.initials}</div>
              <h3>{student.name}</h3>
              <div className="card-actions high">
                <Info size={18} />
                <MessageSquare size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Moderate Risk Section */}
      <section className="risk-section">
        <div className="section-header">
          <AlertTriangle className="icon-warning" size={24} />
          <h2>Moderate Risk Students</h2>
        </div>
        <p className="section-desc">Students who may need additional support and monitoring.</p>
        
        <div className="student-grid">
          {moderateRisk.map(student => (
            <div key={student.id} className="student-card">
              <div className="initials-circle moderate">{student.initials}</div>
              <h3>{student.name}</h3>
              <div className="card-actions moderate">
                <Info size={18} />
                <MessageSquare size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Low Risk Section */}
      <section className="risk-section">
        <div className="section-header">
          <CheckCircle className="icon-success" size={24} />
          <h2>Low Risk Students</h2>
        </div>
        <p className="section-desc">Students performing well with minimal risk indicators.</p>
        
        <div className="student-grid">
          {lowRisk.map(student => (
            <div key={student.id} className="student-card">
              <div className="initials-circle low">{student.initials}</div>
              <h3>{student.name}</h3>
              <div className="card-actions low">
                <Info size={18} />
                <MessageSquare size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
