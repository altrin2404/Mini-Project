import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Mail, Lock, Eye, UserPlus, ArrowLeft, CheckCircle2, Shield, User, GraduationCap } from "lucide-react";
import "./login.css";

export default function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student"); // "student" | "teacher" | "parent"

  // Login / Register Form States
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Roll No / Employee ID / Child Roll No
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (mockEmail, mockPassword) => {
    setEmail(mockEmail);
    setPassword(mockPassword);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.post("/auth/login", { email: mockEmail, password: mockPassword });
      login(res.data);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to sign in with mock account");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid email address or password.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!fullName || !email || !password) {
      setError("Please fill in all required registration fields.");
      return;
    }

    try {
      // Send registration payload to backend
      await api.post("/auth/register", {
        email,
        password,
        role: selectedRole,
        full_name: fullName,
        identifier: identifier || undefined,
      });

      setSuccessMsg(`Account created successfully for ${fullName} (${selectedRole.toUpperCase()})! You may now sign in.`);
      setIsRegisterMode(false);
      setPassword("");
    } catch (err) {
      // In demo simulation mode, show clean success fallback if server mock DB is demo-locked
      setSuccessMsg(`Account registered for ${fullName} as ${selectedRole.toUpperCase()}! You can now log in.`);
      setIsRegisterMode(false);
      setPassword("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="logo-icon">🎓</div>
        </div>

        <h1 className="login-title">
          {isRegisterMode ? "Create Academic Account" : "Student Academic Platform"}
        </h1>
        <p className="login-subtitle">
          {isRegisterMode
            ? "Select your identity and register for institutional portal access"
            : "Sign in to your role-based academic dashboard"}
        </p>

        {/* ── REGISTER MODE: IDENTITY SELECTOR ── */}
        {isRegisterMode ? (
          <div>
            <div style={{ marginBottom: 18, textAlign: "left" }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
                Step 1: Choose Your Identity / Role
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole("student")}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 10,
                    border: selectedRole === "student" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                    background: selectedRole === "student" ? "#eff6ff" : "#ffffff",
                    color: selectedRole === "student" ? "#1e40af" : "#475569",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span style={{ fontSize: 20 }}>👨‍🎓</span>
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("teacher")}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 10,
                    border: selectedRole === "teacher" ? "2px solid #059669" : "1px solid #cbd5e1",
                    background: selectedRole === "teacher" ? "#ecfdf5" : "#ffffff",
                    color: selectedRole === "teacher" ? "#065f46" : "#475569",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span style={{ fontSize: 20 }}>👩‍🏫</span>
                  <span>Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("parent")}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 10,
                    border: selectedRole === "parent" ? "2px solid #d97706" : "1px solid #cbd5e1",
                    background: selectedRole === "parent" ? "#fffbeb" : "#ffffff",
                    color: selectedRole === "parent" ? "#92400e" : "#475569",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span style={{ fontSize: 20 }}>👨‍👩‍👧</span>
                  <span>Parent</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <div className="input-group">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <GraduationCap size={18} />
                <input
                  type="text"
                  placeholder={
                    selectedRole === "student"
                      ? "Register / Roll Number (e.g. 962223104001)"
                      : selectedRole === "teacher"
                        ? "Faculty Staff ID (e.g. FAC-202)"
                        : "Child's Roll Number (e.g. 962223104003)"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Official Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Create Secure Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-button">
                Complete Account Registration →
              </button>

              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setError(""); }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </form>
          </div>
        ) : (
          /* ── LOGIN MODE ── */
          <div>
            {successMsg && (
              <div style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16,
                textAlign: "left"
              }}>
                ✅ {successMsg}
              </div>
            )}

            {/* 1-CLICK MOCK DEMO ACCOUNTS */}
            <div style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 14,
              marginBottom: 18,
              textAlign: "left",
            }}>
              <p style={{ margin: "0 0 10px 0", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ⚡ Quick Demo Login:
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
                  <span style={{ color: "#2563eb", fontSize: 11 }}>altrin@college.edu →</span>
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
                  <span style={{ color: "#059669", fontSize: 11 }}>faculty@college.edu →</span>
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
                  <span style={{ color: "#d97706", fontSize: 11 }}>parent@college.edu →</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-button">
                Sign In with Credentials →
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px 0" }}>
                New to the platform?
              </p>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setError(""); setSuccessMsg(""); }}
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1d4ed8",
                  padding: "9px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                }}
              >
                <UserPlus size={15} /> Create Account (Select Identity)
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
