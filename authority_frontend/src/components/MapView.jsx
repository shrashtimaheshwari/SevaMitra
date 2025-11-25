import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchReports } from "../utils/api";
import { socket } from "../utils/socket";
import HeatmapLayer from "./HeatmapLayer";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Auto Zoom Fit Based On Reports
function AutoFitView({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!markers.length) return;
    const bounds = markers.map(m => [m.location.lat, m.location.lng]);
    map.fitBounds(bounds, { padding: [90, 90] });
  }, [markers]);
  return null;
}

export default function MapView() {
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    try {
      const data = await fetchReports();
      setReports(data.items || data);
    } catch (err) {
      console.error("Error loading reports:", err);
    }
  };

  useEffect(() => {
    loadReports();
    socket.connect();

    socket.on("report_created", loadReports);
    socket.on("report_updated", loadReports);

    return () => {
      socket.off("report_created", loadReports);
      socket.off("report_updated", loadReports);
      socket.disconnect();
    };
  }, []);

  // Heatmap Points Format: [lat, lng, intensity]
  const heatPoints = reports
    .filter(r => r.location?.lat && r.location?.lng)
    .map(r => [
      r.location.lat,
      r.location.lng,
      r.category === "Road"
        ? 2.5
        : r.category === "Traffic"
        ? 3
        : r.category === "Sewage"
        ? 4
        : 1.5 // default
    ]);

  const defaultCenter = [22.7196, 75.8577];

  return (
    <>
      {/* Badge: Always ON (Heatmap mode) */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(0,0,0,0.6)",
          padding: "6px 14px",
          borderRadius: "6px",
          color: "#ff9800",
          fontWeight: "bold",
          fontSize: "13px",
          backdropFilter: "blur(4px)",
          zIndex: 9999
        }}
      >
        🔥 LIVE HEATMAP ACTIVE
      </div>

      {/* MAP */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
          filter: "contrast(1.15) brightness(80%)",
          transition: "0.4s ease"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <AutoFitView markers={reports} />

        {/* ALWAYS ON Heatmap */}
        <HeatmapLayer points={heatPoints} />

        {/* Markers */}
        {reports.map(report => (
          <Marker
            key={report._id}
            position={[report.location.lat, report.location.lng]}
            opacity={0.9}
          >
            <Popup>
              <strong>{report.category}</strong> <br />
              {report.description} <br /><br />
              
              {report.imageBase64 && (
                <img
                  src={report.imageBase64}
                  alt="Issue"
                  style={{ width: "100%", borderRadius: "8px", marginTop: "6px" }}
                />
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
