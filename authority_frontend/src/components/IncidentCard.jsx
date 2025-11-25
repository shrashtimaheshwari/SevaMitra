import React from "react";
import { FiCheckCircle, FiTrash2, FiMapPin } from "react-icons/fi";
import "./IncidentCard.css";

export default function IncidentCard({ incident, onResolve, onDelete, onShowMap }) {
  return (
    <div className={`incident-card card ${incident.status === "resolved" ? "resolved" : ""}`}>
      
      <div className="incident-content">
        <h3 className="incident-title">{incident.category} Issue</h3>
        <p className="incident-desc">{incident.description}</p>

        <div className="incident-meta">
          <span>📌 {incident.location?.address || "Location Available"}</span>
          <span>👤 {incident.fullName}</span>
          <span>📞 {incident.contactNumber}</span>
        </div>

        {incident.imageUrl && (
          <img
  src={
    incident.imageBase64 ||
    incident.imageUrl ||
    (incident.imageData
      ? `data:${incident.imageMime};base64,${incident.imageData}`
      : null)
  }
  alt="Report"
  className="incident-image"
/>
        )}
      </div>

      <div className="incident-actions">
        <button title="Show on Map" className="action-btn" onClick={onShowMap}>
          <FiMapPin />
        </button>

        {/* <button title="Mark Resolved" className="action-btn success" onClick={onResolve}>
          <FiCheckCircle />
        </button> */}

        <button title="Delete" className="action-btn success" onClick={onDelete}>
          <FiCheckCircle/>  
        </button>
      </div>
    </div>
  );
}