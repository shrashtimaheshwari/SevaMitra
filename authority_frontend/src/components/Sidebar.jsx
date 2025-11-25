import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/logo.jpg";
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo"><img src={logo} alt="SevaMitra Logo" className="logo-img"/></div>
        
      </div>

      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/incidents">Incidents</Link>
      </nav>

    </aside>
  );
}
