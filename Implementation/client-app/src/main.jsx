import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { SimulationProvider } from "./simulations/SimulationContext";
import App from "./App";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./styles/index.css";
import "./utils/chartSetup";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorBoundary>
      <SimulationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SimulationProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
