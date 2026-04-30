const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const TOKEN_KEY = 'yuplaced_token';

export interface AuthResponse {
  access_token: string;
  token_type?: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.detail === 'string' ? data.detail : 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    return data;
  },

  async signup(nickname: string, email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ nickname, email, password }),
    });
    setToken(data.access_token);
    return data;
  },

  logout(): void {
    removeToken();
  },
};
