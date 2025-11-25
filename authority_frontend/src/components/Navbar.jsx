import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { toggleTheme, darkMode } = useContext(ThemeContext);

  return (
    <header className="navbar card">
      <div className="left">
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>
      <div className="right">
        <button onClick={toggleTheme} className="small">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}
