const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  return {
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error');
    }
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Something went wrong');
  }
  if (response.status === 200 && response.headers.get('content-length') === '0') {
    return null;
  }
  return response.json();
};

const api = {
  register: (userData) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  }).then(handleResponse),

  login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials),
  }).then(handleResponse),

  createAlert: (alertData) => fetch(`${API_BASE_URL}/admin/alerts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(alertData),
  }).then(handleResponse),

  getAllAlerts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/alerts?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateAlert: (id, alertData) => fetch(`${API_BASE_URL}/admin/alerts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(alertData),
  }).then(handleResponse),

  // User
  getUserAlerts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/user/alerts?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  markAsRead: (id) => fetch(`${API_BASE_URL}/user/alerts/${id}/read`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(handleResponse),

  snoozeAlert: (id) => fetch(`${API_BASE_URL}/user/alerts/${id}/snooze`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(handleResponse),

  getSnoozedAlerts: () => fetch(`${API_BASE_URL}/user/alerts/snoozed`, {
    headers: getAuthHeaders(),
  }).then(handleResponse),

  getAnalytics: () => fetch(`${API_BASE_URL}/analytics`, {
    headers: getAuthHeaders(),
  }).then(handleResponse),
};

export default api;