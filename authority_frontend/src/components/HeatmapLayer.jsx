import { useMap } from "react-leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ points }) {
  const map = useMap();

  if (!map || !points || points.length === 0) return null;

  const heatLayer = window.L.heatLayer(points, {
    radius: 28,
    blur: 18,
    maxZoom: 17,
    gradient: {
      0.1: "blue",
      0.4: "lime",
      0.7: "yellow",
      1.0: "red"
    }
  });

  heatLayer.addTo(map);

  return null;
}
