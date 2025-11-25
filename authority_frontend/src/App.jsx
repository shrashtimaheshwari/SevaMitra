import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Incidents from "./pages/Incidents.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Navbar />

            <Routes>
              {/* NO LOGIN, NO TOKEN CHECKS */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<Incidents />} />

              {/* optional fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>

          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

