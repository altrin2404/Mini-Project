import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { SimulationProvider } from "./simulations/SimulationContext";
import App from "./App";
import "./styles/index.css";
import "./utils/chartSetup";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SimulationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SimulationProvider>
  </BrowserRouter>
);
