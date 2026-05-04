/**
 * YUPLACED — Yunote API Client
 * Mirrors legacy api.js Yunote + profile endpoints.
 * Uses the same token from authApi.
 */

import { getToken } from './authApi';
import type { Folder } from '../../entities/folder/model/types';
import type { Task } from '../../entities/task/model/types';
import type { DayReport } from '../../entities/day-report/model/types';
import type { PomodoroSession } from '../../entities/pomodoro/model/types';
import type { UserSettings } from '../../entities/settings/model/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.detail === 'string' ? data.detail : 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

// ── Folders ─────────────────────────────────────────────────────

export async function fetchFolders(): Promise<Folder[]> {
  return apiFetch<Folder[]>('/yunote/folders');
}

export async function saveFolders(folders: Folder[]): Promise<void> {
  await apiFetch('/yunote/folders', {
    method: 'PUT',
    body: JSON.stringify(folders),
  });
}

// ── Tasks ───────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  return apiFetch<Task[]>('/yunote/tasks');
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await apiFetch('/yunote/tasks', {
    method: 'PUT',
    body: JSON.stringify(tasks),
  });
}

// ── Day Report ──────────────────────────────────────────────────

export async function fetchDays(): Promise<DayReport> {
  return apiFetch<DayReport>('/yunote/days');
}

export async function saveDay(dateKey: string, day: DayReport): Promise<void> {
  await apiFetch(`/yunote/days/${dateKey}`, {
    method: 'PUT',
    body: JSON.stringify(day),
  });
}

// ── Stats ───────────────────────────────────────────────────────

export interface YunoteStats {
  timeTracked: string;
  tasksDone: number;
  daysLogged: number;
  streak: string;
}

export async function fetchStats(): Promise<YunoteStats> {
  return apiFetch<YunoteStats>('/yunote/stats');
}

// ── Profile / Settings ──────────────────────────────────────────

export async function fetchProfile(): Promise<UserSettings> {
  return apiFetch<UserSettings>('/yunote/profile');
}

export async function saveProfile(settings: UserSettings): Promise<void> {
  await apiFetch('/yunote/profile', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// ── Pomodoro Sessions ───────────────────────────────────────────

export async function fetchPomodoroSessions(): Promise<PomodoroSession[]> {
  return apiFetch<PomodoroSession[]>('/yunote/pomodoro/sessions');
}

export async function savePomodoroSession(session: PomodoroSession): Promise<void> {
  await apiFetch('/yunote/pomodoro/sessions', {
    method: 'POST',
    body: JSON.stringify(session),
  });
}

// ── AI Insight ──────────────────────────────────────────────────

export async function generateInsight(doneItems: string[]): Promise<string> {
  const data = await apiFetch<{ insight: string }>('/yunote/insight', {
    method: 'POST',
    body: JSON.stringify({ done: doneItems }),
  });
  return data.insight;
}
