import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* --- AUTH --- */
export async function login(credentials) {
  const res = await api.post("/auth/login", credentials);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}

/* --- REPORTS --- */
export async function fetchReports() {
  const res = await api.get("/reports");

  // Normalize response (backend returns {items: [...]})
  return res.data.items || res.data;
}

// Resolve report
export async function resolveReport(id) {
  const res = await api.patch(`/reports/${id}/resolve`);
  return res.data;
}

// Delete report
export async function deleteReport(id) {
  const res = await api.delete(`/reports/${id}`);
  return res.data;
}

export default api;
