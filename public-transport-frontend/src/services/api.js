// API Service communicating with Spring Boot REST Backend
const BASE_URL = '/api';

// Helper for fetch with JSON error handling
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: `Server responded with status ${res.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Dashboard
  getDashboardStats: async () => {
    return await request('/dashboard');
  },

  // Buses
  getBuses: async (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return await request(`/buses${query}`);
  },

  getBusById: async (id) => {
    return await request(`/buses/${id}`);
  },

  createBus: async (busData) => {
    return await request('/buses', {
      method: 'POST',
      body: JSON.stringify(busData),
    });
  },

  updateBus: async (id, busData) => {
    return await request(`/buses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(busData),
    });
  },

  updatePassengers: async (id, count, peak) => {
    const peakParam = peak !== undefined ? `&peak=${peak}` : '';
    return await request(`/buses/${id}/passengers?count=${count}${peakParam}`, {
      method: 'PATCH',
    });
  },

  deleteBus: async (id) => {
    return await request(`/buses/${id}`, {
      method: 'DELETE',
    });
  },

  // User Reports
  getReports: async () => {
    return await request('/reports');
  },

  getReportsByBus: async (busId) => {
    return await request(`/reports/bus/${busId}`);
  },

  submitReport: async (reportData) => {
    return await request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  // Predictions
  getAllPredictions: async () => {
    return await request('/predictions');
  },

  getPredictionsByBus: async (busId) => {
    return await request(`/predictions/bus/${busId}`);
  },

  triggerPrediction: async (busId) => {
    return await request(`/predictions/${busId}`, {
      method: 'POST',
    });
  },

  getLivePrediction: async (busId) => {
    return await request(`/predictions/live/${busId}`);
  },
};
