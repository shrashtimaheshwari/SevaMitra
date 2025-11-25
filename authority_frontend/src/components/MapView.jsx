import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchReports } from "../utils/api";
import { socket } from "../utils/socket";
import "leaflet/dist/leaflet.css";

// Fix missing default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Auto adjust map zoom and center based on active markers
function AutoFitView({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) return;

    const bounds = markers.map(m => [m.location.lat, m.location.lng]);
    map.fitBounds(bounds, { padding: [100, 100] });

  }, [markers, map]);

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

    // WebSocket live updates
    socket.connect();

    socket.on("report_created", () => {
      console.log("📥 New report received");
      loadReports();
    });

    socket.on("report_updated", () => {
      console.log("♻ Report resolved/deleted");
      loadReports();
    });

    return () => {
      socket.off("report_created");
      socket.off("report_updated");
      socket.disconnect();
    };
  }, []);

  // Group reports by identical coordinates
  const grouped = reports.reduce((acc, r) => {
    if (!r.location?.lat || !r.location?.lng) return acc;

    const key = `${r.location.lat}-${r.location.lng}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  // Spread markers in a circle if stacked
  const spreadOffset = (index, total) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 0.00015; // adjust spacing
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  };

  const defaultCenter = [22.7196, 75.8577];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <AutoFitView markers={reports} />

      {Object.values(grouped).map(group =>
        group.map((report, index) => {
          const [offLat, offLng] =
            group.length > 1 ? spreadOffset(index, group.length) : [0, 0];

          return (
            <Marker
              key={report._id}
              position={[report.location.lat + offLat, report.location.lng + offLng]}
            >
              <Popup>
                <strong>{report.category}</strong><br />
                {report.description}<br /><br />

                {report.imageBase64 && (
                  <img
                    src={report.imageBase64}
                    alt="Issue"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                )}
              </Popup>
            </Marker>
          );
        })
      )}
    </MapContainer>
  );
}
