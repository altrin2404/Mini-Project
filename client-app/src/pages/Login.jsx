import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Mail, Lock, Eye } from "lucide-react"; // Icons B

import "./login.css"; // CSS A

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (mockEmail, mockPassword) => {
    setEmail(mockEmail);
    setPassword(mockPassword);
    setError("");

    try {
      const res = await api.post("/auth/login", { email: mockEmail, password: mockPassword });
      login(res.data);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to sign in with mock account");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="logo-icon">🎓</div>
        </div>

        <h1 className="login-title">Digital Twin Portal</h1>
        <p className="login-subtitle">
          Sign in to your role-based academic dashboard
        </p>

        {/* ── 1-CLICK MOCK DEMO ACCOUNTS ── */}
        <div style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: 14,
          marginBottom: 20,
          textAlign: "left",
        }}>
          <p style={{ margin: "0 0 10px 0", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            ⚡ 1-Click Mock Role Login:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickLogin("altrin@college.edu", "student123")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "white",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                color: "#1e293b",
                transition: "all 0.15s",
              }}
            >
              <span>👨‍🎓 <strong>Student</strong> (Altrin)</span>
              <span style={{ color: "#6366f1", fontSize: 11 }}>altrin@college.edu →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("faculty@college.edu", "teacher123")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "white",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                color: "#1e293b",
                transition: "all 0.15s",
              }}
            >
              <span>👩‍🏫 <strong>Faculty</strong> (Dr. Arulraj)</span>
              <span style={{ color: "#10b981", fontSize: 11 }}>faculty@college.edu →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("parent@college.edu", "parent123")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "white",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                color: "#1e293b",
                transition: "all 0.15s",
              }}
            >
              <span>👨‍👩‍👧 <strong>Parent</strong> (Mr. Benser)</span>
              <span style={{ color: "#f59e0b", fontSize: 11 }}>parent@college.edu →</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          {error && <div className="login-error">{error}</div>}

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Eye size={16} className="eye-icon" />
          </div>

          <button type="submit" className="login-button">
            Sign In with Credentials →
          </button>
        </form>

        <p className="login-footer">
          Role-Based Access Control • Digital Twin Portal
        </p>
      </div>
    </div>
  );
}
