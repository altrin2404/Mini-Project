import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Line, Bar } from "react-chartjs-2";
import { Filter, Download, TrendingUp, Users, AlertCircle, BarChart3 } from "lucide-react";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin")
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Admin Dashboard Error:", err);
        setError("Failed to load analytics. Please try again.");
      });
  }, []);

  if (error) return <div className="admin-page"><p className="error-text">{error}</p></div>;
  if (!data) return <p className="loading-text">Loading system analytics...</p>;

  const enrollmentData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [{
      label: "Students",
      data: data.enrollment_trend,
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4
    }]
  };

  const riskData = {
    labels: data.risk_distribution.map(d => d.grade),
    datasets: [{
      label: "Risk Score",
      data: data.risk_distribution.map(d => d.score),
      backgroundColor: ["#ef4444", "#f59e0b", "#8b5cf6", "#10b981"],
      borderRadius: 8
    }]
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Reports & Analytics</h1>
        <p>Deep dive into institution-level data and trends.</p>
        
        <div className="header-icons">
          <button className="icon-btn"><Filter size={18} /></button>
          <button className="icon-btn"><Download size={18} /></button>
        </div>
      </header>

      <div className="admin-tabs">
        <span className="active">Trends</span>
        <span>Distribution</span>
        <span>Comparison</span>
        <span>Performance</span>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Enrollment Growth by Year</h3>
          <p className="sub-text">Total students over time</p>
          <div className="chart-area">
             <Line data={enrollmentData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <button className="export-btn"><Download size={16} /> Export Data</button>
        </div>

        <div className="admin-card">
          <h3>Risk Score Distribution by Grade</h3>
          <p className="sub-text">Current academic year</p>
          <div className="chart-area">
             <Bar data={riskData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <button className="export-btn"><Download size={16} /> Export Data</button>
        </div>
      </div>
    </div>
  );
}
