const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api/v1' 
  : 'https://studentperformanceanalytics.onrender.com/api/v1';

export const api = {
  getStudents: async () => {
    try {
      const res = await fetch(`${BASE_URL}/students/`);
      if (!res.ok) return [];
      const data = await res.json();
      // Normalize backend snake_case properties to frontend camelCase parameters
      return data.map(s => ({
        id: s.id,
        studentId: s.student_id,
        name: s.full_name,
        department: s.department,
        gpa: s.cgpa,
        attendance: s.attendance_percentage
      }));
    } catch { return []; }
  },
  getTopPerformers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/top-performers`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map(s => ({
        name: s.full_name || s.name,
        gpa: s.cgpa || s.gpa
      }));
    } catch { return []; }
  },
  getAtRiskStudents: async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/at-risk`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map(s => ({
        name: s.full_name || s.name,
        department: s.department,
        gpa: s.cgpa || s.gpa
      }));
    } catch { return []; }
  },
  getStudentReport: async (studentId) => {
    try {
      const res = await fetch(`${BASE_URL}/reports/student/${studentId}`);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  }
};
