import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled rendering error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: 24,
        }}>
          <div style={{
            maxWidth: 500,
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px 0" }}>
              Portal Render Shield
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20, lineHeight: 1.5 }}>
              A temporary runtime issue occurred, but your session is protected. Click below to return to the active overview dashboard.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
              onMouseOut={(e) => e.target.style.background = "#2563eb"}
            >
              Return to Home Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
