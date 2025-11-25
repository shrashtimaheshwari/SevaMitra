import React, { useEffect, useState } from "react";
import IncidentCard from "../components/IncidentCard.jsx";
import MapModal from "../components/MapModal.jsx";
import { fetchReports, resolveReport, deleteReport } from "../utils/api";

export default function Incidents() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [mapPoint, setMapPoint] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchReports();
      setReports(data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  const onResolve = async (id) => {
    try {
      await resolveReport(id);
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: "resolved" } : r));
    } catch (e) { console.error(e); }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Mark as Completed?")) return;
    try {
      await deleteReport(id);
      setReports(prev => prev.filter(r => r._id !== id));
    } catch (e) { console.error(e); }
  };

  const filtered = filter === "All" ? reports : reports.filter(r => r.category === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Reports</h3>
       <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
  <option>All</option>
  <option>Road</option>
  <option>Sewage</option>
  <option>Washroom</option>
  <option>Garbage</option>
  <option>Traffic</option>
  <option>Other</option>
</select>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading ? <div>Loading...</div> : (
          filtered.length === 0 ? <div className="small">No reports yet.</div> :
            filtered.map(r => (
              <IncidentCard
                key={r._id}
                incident={r}
                onResolve={() => onResolve(r._id)}
                onDelete={() => onDelete(r._id)}
                onShowMap={() => setMapPoint(r.location)}
              />
            ))
        )}
      </div>

      {mapPoint && <MapModal point={mapPoint} onClose={() => setMapPoint(null)} />}
    </div>
  );
}