// src/components/IncidentCard.jsx
import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiTrash2, FiMapPin } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./IncidentCard.css";

dayjs.extend(relativeTime);

export default function IncidentCard({ incident, onResolve, onDelete, onShowMap }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!incident.createdAt) return;

    const update = () => {
      setTimeAgo(dayjs(incident.createdAt).fromNow());   // e.g. "2 hours ago"
    };

    update(); // run once immediately
    const id = setInterval(update, 60 * 1000); // update every minute

    return () => clearInterval(id);
  }, [incident.createdAt]);

  const imgSrc =
    incident.imageBase64 ||
    incident.imageUrl ||
    null;

  return (
    <div className={`incident-card card ${incident.status === "resolved" ? "resolved" : ""}`}>
      <div className="incident-content">
        <div className="incident-header-row">
          <h3 className="incident-title">{incident.category} Issue</h3>
          {timeAgo && (
            <span className="incident-time small">
              ⏱ Reported {timeAgo}
            </span>
          )}
        </div>

        <p className="incident-desc">{incident.description}</p>

        <div className="incident-meta">
          <span>👤 {incident.fullName}</span>
          <span>📞 {incident.contactNumber}</span>
          {incident.location?.address && <span>📌 {incident.location.address}</span>}
        </div>

        {imgSrc && (
          <img
            src={imgSrc}
            alt="report"
            className="incident-image"
            onClick={() => window.open(imgSrc, "_blank")}
          />
        )}
      </div>

      <div className="incident-actions">
        <button title="Show on Map" className="action-btn" onClick={onShowMap}>
          <FiMapPin />
        </button>

        <button title="Mark Resolved" className="action-btn success" onClick={onDelete}>
          <FiCheckCircle />
        </button>

        {/* <button title="Delete" className="action-btn danger" onClick={onDelete}>
          <FiTrash2 />
        </button> */}
      </div>
    </div>
  );
}
