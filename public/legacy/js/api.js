/**
 * YUPLACED — API Client
 * Централизованный модуль для работы с бэкендом
 */

const API_URL = 'http://localhost:8000/api';

/* ── Token helpers ── */
function getToken()        { return localStorage.getItem('yuplaced_token'); }
function setToken(token)   { localStorage.setItem('yuplaced_token', token); }
function removeToken()     { localStorage.removeItem('yuplaced_token'); }
function isLoggedIn()      { return !!getToken(); }

/* ── Base fetch ── */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('yuplaced_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_URL + path, { ...options, headers });

  if (res.status === 401) {
      //removeToken();
      throw new Error('Unauthorized');
  }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || 'Request failed');
    return data;
  }

/* ── Auth ── */
const Auth = {
  async signup(nickname, email, password) {
    const data = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ nickname, email, password }),
    });
    setToken(data.access_token);
    return data;
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
    });
    setToken(data.access_token);
    return data;
  },

  async sendCode(email) {
    return apiFetch('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyCode(email, code) {
    return apiFetch('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async resetPassword(email, code, new_password) {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, new_password }),
    });
  },

  logout() {
    removeToken();
    window.location.href = 'login.html';
  },
};

/* ── YUNOTE ── */
const Yunote = {
  async getDays() {
    return apiFetch('/yunote/days');
  },

  async getDay(dateKey) {
    return apiFetch(`/yunote/days/${dateKey}`);
  },

  async saveDay(dateKey, dayData) {
    return apiFetch(`/yunote/days/${dateKey}`, {
      method: 'PUT',
      body: JSON.stringify(dayData),
    });
  },

  async deleteDay(dateKey) {
    return apiFetch(`/yunote/days/${dateKey}`, { method: 'DELETE' });
  },

  async getStats() {
    return apiFetch('/yunote/stats');
  },
};
