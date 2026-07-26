export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message = 'Request failed';
    if (payload?.message) {
      message = payload.message;
    } else if (payload?.errors) {
      message = Object.values(payload.errors).flat().join(' ');
    }
    throw new Error(message);
  }

  return payload;
}

export const api = {
  getSchedule: (date) => request(`/schedule?date=${date}`),
  getSeance: (id) => request(`/seances/${id}`),
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBooking: (code) => request(`/bookings/${code}`),
  bookingQrUrl: (code) => `${API_BASE}/bookings/${code}/qr`,

  login: (data) => request('/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/admin/logout', { method: 'POST' }),
  me: () => request('/admin/me'),

  getHalls: () => request('/admin/halls'),
  createHall: (data) => request('/admin/halls', { method: 'POST', body: JSON.stringify(data) }),
  deleteHall: (id) => request(`/admin/halls/${id}`, { method: 'DELETE' }),
  updateHallLayout: (id, data) => request(`/admin/halls/${id}/layout`, { method: 'PUT', body: JSON.stringify(data) }),
  updateHallPrices: (id, data) => request(`/admin/halls/${id}/prices`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleHallActive: (id) => request(`/admin/halls/${id}/toggle-active`, { method: 'PATCH' }),

  getMovies: () => request('/admin/movies'),
  createMovie: (data) => request('/admin/movies', { method: 'POST', body: JSON.stringify(data) }),
  deleteMovie: (id) => request(`/admin/movies/${id}`, { method: 'DELETE' }),
  uploadPoster: (id, file) => {
    const formData = new FormData();
    formData.append('poster', file);
    return request(`/admin/movies/${id}/poster`, { method: 'POST', body: formData });
  },

  getSeancesTimeline: (date) => request(`/admin/seances/timeline?date=${date}`),
  createSeance: (data) => request('/admin/seances', { method: 'POST', body: JSON.stringify(data) }),
  deleteSeance: (id) => request(`/admin/seances/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/admin/settings'),
  toggleSales: () => request('/admin/settings/sales', { method: 'PATCH' }),
};
