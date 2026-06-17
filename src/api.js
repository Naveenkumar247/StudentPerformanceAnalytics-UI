const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api/v1' 
  : 'https://studentperformanceanalytics.onrender.com/api/v1';

export const api = {
  getStudents: async () => {
    try {
      const res = await fetch(`${BASE_URL}/students/`);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  },
  getTopPerformers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/top-performers`);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  },
  getAtRiskStudents: async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/at-risk`);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  }
};
