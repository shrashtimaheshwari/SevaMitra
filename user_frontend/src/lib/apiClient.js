// src/lib/apiClient.js
const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function postReport(payload, { timeout = 30000 } = {}) {
  if (!API_ORIGIN) {
    // mock fallback used during local dev without backend
    const reports = JSON.parse(localStorage.getItem('mock_reports') || '[]');
    const id = 'mock_' + Date.now();
    reports.unshift({ ...payload, _id: id, createdAt: new Date().toISOString(), status: 'open' });
    localStorage.setItem('mock_reports', JSON.stringify(reports));
    return { success: true, reportId: id };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_ORIGIN}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(text || `Server responded ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
}

async function fetchPhonebook() {
  if (!API_ORIGIN) {
    return JSON.parse(localStorage.getItem('mock_phonebook') || '[]');
  }
  const res = await fetch(`${API_ORIGIN}/phonebook`);
  if (!res.ok) throw new Error('Failed to load phonebook');
  return res.json();
}

export { postReport, fetchPhonebook };
export default { postReport, fetchPhonebook };
