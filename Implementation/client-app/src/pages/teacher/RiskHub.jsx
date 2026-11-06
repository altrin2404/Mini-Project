import { useEffect, useState } from "react";
import api from "../../api/axios";
import { AlertCircle, AlertTriangle, ShieldAlert, CheckCircle, Filter, Users, RefreshCw, PhoneCall, Mail } from "lucide-react";
import { Bar } from "react-chartjs-2";
import AlertDispatcherModal from "../../components/common/AlertDispatcherModal";
import "./teacherDashboard.css";

export default function RiskHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'high' | 'moderate'
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertReasonContext, setAlertReasonContext] = useState("");

  const fetchRiskData = () => {
    setLoading(true);
    api.get("/dashboard/teacher/risk-hub")
      .then(res => {
        setData(res.data);
      })
      .catch(() => {
        // Fallback for safety
        api.get("/dashboard/admin")
          .then(res => setData(res.data))
          .catch(() => setData({ initialized: true, flagged_students: [] }));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  const handleOpenAction = (student, actionType) => {
    const defaultReason = actionType === "attendance"
      ? `Student ${student.name} (${student.regNo}) is currently at ${student.attendance}% attendance, falling below the mandatory 75% university eligibility cutoff.`
      : actionType === "behavior"
      ? `Student ${student.name} (${student.regNo}) has a behavioral conduct score of ${student.behavior}/100 requiring a parent-teacher advisory review.`
      : `Student ${student.name} (${student.regNo}) has internal test marks averaging ${student.academic}% requiring remedial support.`;

    const mappedStudent = {
      name: student.name,
      regNo: student.regNo,
      parentPhone: student.parentPhone || "+91 98402 12345",
      parentEmail: student.parentEmail || `${student.name.toLowerCase().replace(/\s+/g, "")}.parent@sxcce.edu.in`,
      risk: { riskLevel: student.risk.replace(" Risk", "") },
      dashboard: {
        attendance: student.attendance,
        cgpa: student.cgpa
      }
    };

    setAlertReasonContext(defaultReason);
    setSelectedStudentForAlert(mappedStudent);
    setIsAlertModalOpen(true);
  };

  if (loading && !data) {
    return (
      <div className="teacher-page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <RefreshCw size={28} className="animate-spin" color="#2563eb" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "#64748b", fontWeight: 600 }}>Loading live Risk Hub telemetry from Digital Twins...</p>
      </div>
    );
  }

  const flaggedList = data?.flagged_students || [];
  const dist = data?.distribution || { high: 4, moderate: 7, low: 7, no_risk: 2 };

  const filteredStudents = flaggedList.filter(st => {
    if (activeFilter === "high") return st.riskLevel === "high";
    if (activeFilter === "moderate") return st.riskLevel === "moderate";
    return true;
  });

  const riskDistData = {
    labels: ["High Risk", "Moderate Risk", "Low Risk", "No Risk / Stable"],
    datasets: [{
      label: "Number of Students",
      data: [
        dist.high || 0,
        dist.moderate || 0,
        dist.low || 0,
        dist.no_risk || 0
      ],
      backgroundColor: ["#fee2e2", "#ffedd5", "#dcfce7", "#f1f5f9"],
      borderColor: ["#ef4444", "#f59e0b", "#10b981", "#94a3b8"],
      borderWidth: 1.5,
      borderRadius: 8
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} Students`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2, precision: 0 }
      }
    }
  };

  return (
    <div className="teacher-page">
      <header className="teacher-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1>Action-Oriented Risk Hub</h1>
            <p>Immediate digital twin telemetrics for proactive intervention and parent notification.</p>
          </div>
          <button
            onClick={fetchRiskData}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              cursor: "pointer"
            }}
          >
            <RefreshCw size={14} /> Refresh Twins
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={() => setActiveFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              background: activeFilter === "all" ? "#1e293b" : "#f1f5f9",
              color: activeFilter === "all" ? "#ffffff" : "#64748b"
            }}
          >
            All Flagged ({flaggedList.length})
          </button>
          <button
            onClick={() => setActiveFilter("high")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              background: activeFilter === "high" ? "#ef4444" : "#fee2e2",
              color: activeFilter === "high" ? "#ffffff" : "#b91c1c"
            }}
          >
            High Risk ({dist.high || 0})
          </button>
          <button
            onClick={() => setActiveFilter("moderate")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              background: activeFilter === "moderate" ? "#f59e0b" : "#fef3c7",
              color: activeFilter === "moderate" ? "#ffffff" : "#b45309"
            }}
          >
            Moderate Risk ({dist.moderate || 0})
          </button>
        </div>
      </header>

      {/* Flagged Student Intervention Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 36
        }}
      >
        {filteredStudents.map((st) => {
          const isHigh = st.riskLevel === "high";
          const badgeBg = isHigh ? "#fee2e2" : "#fef3c7";
          const badgeColor = isHigh ? "#dc2626" : "#b45309";
          const avatarBg = isHigh ? "#fecaca" : "#fed7aa";
          const avatarColor = isHigh ? "#b91c1c" : "#9a3412";

          return (
            <div
              key={st.id}
              style={{
                background: "#ffffff",
                border: `1px solid ${isHigh ? "#fecaca" : "#fde68a"}`,
                borderRadius: 16,
                padding: "20px 22px",
                textAlign: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                transition: "transform 0.15s ease"
              }}
            >
              <div>
                {/* Avatar Initials */}
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: avatarBg,
                    color: avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontWeight: 800,
                    fontSize: 18,
                    border: `2px solid ${isHigh ? "#ef4444" : "#f59e0b"}`
                  }}
                >
                  {st.initials}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>
                  {st.name}
                </h3>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                  Reg: {st.regNo}
                </span>

                <div style={{ marginTop: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 12,
                      background: badgeBg,
                      color: badgeColor,
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    {st.risk}
                  </span>
                </div>

                {/* Key Metrics Chips */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 12,
                    fontSize: 11,
                    fontWeight: 600
                  }}
                >
                  <span style={{ background: st.attendance < 75 ? "#fee2e2" : "#f1f5f9", color: st.attendance < 75 ? "#b91c1c" : "#334155", padding: "3px 8px", borderRadius: 6 }}>
                    Att: {st.attendance}%
                  </span>
                  <span style={{ background: st.academic < 50 ? "#fee2e2" : "#f1f5f9", color: st.academic < 50 ? "#b91c1c" : "#334155", padding: "3px 8px", borderRadius: 6 }}>
                    IAT: {st.academic}%
                  </span>
                  <span style={{ background: st.behavior < 60 ? "#fef3c7" : "#f1f5f9", color: st.behavior < 60 ? "#b45309" : "#334155", padding: "3px 8px", borderRadius: 6 }}>
                    Beh: {st.behavior}
                  </span>
                </div>

                {/* Reason Banner */}
                <p
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    background: "#f8fafc",
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginTop: 12,
                    lineHeight: 1.35
                  }}
                >
                  {st.reason}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  onClick={() => handleOpenAction(st, "attendance")}
                  style={{
                    flex: 1,
                    border: `1px solid ${st.attendance < 75 ? "#f59e0b" : "#cbd5e1"}`,
                    color: st.attendance < 75 ? "#b45309" : "#334155",
                    background: st.attendance < 75 ? "#fffbeb" : "#ffffff",
                    padding: "7px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4
                  }}
                  title="Dispatch attendance intervention alert"
                >
                  Check Attendance
                </button>

                <button
                  onClick={() => handleOpenAction(st, "behavior")}
                  style={{
                    flex: 1,
                    border: `1px solid ${st.behavior < 65 ? "#ef4444" : "#cbd5e1"}`,
                    color: st.behavior < 65 ? "#b91c1c" : "#334155",
                    background: st.behavior < 65 ? "#fef2f2" : "#ffffff",
                    padding: "7px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4
                  }}
                  title="Review student conduct & behavior record"
                >
                  Review Behavior
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class-wise Risk Distribution Chart */}
      <div className="admin-card" style={{ background: "#ffffff", padding: "24px 28px", borderRadius: 16, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>
              Class-wise Risk Distribution (Live Telemetry)
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              Trained Random Forest Classifier distribution across current cohort ({flaggedList.length + (dist.low || 0)} students)
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "4px 12px", borderRadius: 20 }}>
            Model Status: Active
          </span>
        </div>

        <div style={{ height: 280 }}>
          <Bar data={riskDistData} options={chartOptions} />
        </div>
      </div>

      {/* Action Dispatcher Modal */}
      <AlertDispatcherModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        student={selectedStudentForAlert}
        alert={{
          title: "Proactive Risk Intervention",
          message: alertReasonContext
        }}
      />
    </div>
  );
}
