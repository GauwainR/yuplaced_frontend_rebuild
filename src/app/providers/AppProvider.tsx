import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { mockDayReport } from '../../entities/day-report/model/mockDayReport';
import { mockFolders } from '../../entities/folder/model/mockFolders';
import { mockTasks } from '../../entities/task/model/mockTasks';
import {
  mockPomodoroSettings,
  mockPomodoroSessions,
  mockPomodoroStats,
} from '../../entities/pomodoro/model/mockPomodoro';
import { mockUserSettings } from '../../entities/settings/model/mockSettings';
import type { Folder } from '../../entities/folder/model/types';
import type { Task, TaskPriority, TaskStatus } from '../../entities/task/model/types';
import type { DayReport, NextTask } from '../../entities/day-report/model/types';
import type {
  PomodoroSession,
  PomodoroSettings,
  PomodoroStats,
} from '../../entities/pomodoro/model/types';
import type { UserSettings } from '../../entities/settings/model/types';

type PomodoroState = {
  settings: PomodoroSettings;
  sessions: PomodoroSession[];
  stats: PomodoroStats;
};

type AppContextValue = {
  folders: Folder[];
  tasks: Task[];
  dayReport: DayReport;
  pomodoro: PomodoroState;
  settings: UserSettings;

  // Tasks
  toggleTask: (taskId: number) => void;
  addTaskFull: (input: {
    folderId: number;
    title: string;
    priority: TaskPriority;
    comment: string;
    status: TaskStatus;
  }) => void;

  // Folders
  addFolder: (input: { name: string; color: string }) => void;

  // Daily report
  setActiveDay: (dayId: number) => void;
  addDoneItem: (text: string) => void;
  removeDoneItem: (index: number) => void;
  addNextTask: (title: string) => void;
  removeNextTask: (id: number) => void;
  promoteSuggested: (id: number) => void;
  updateNote: (note: string) => void;
  updateValue: (value: string) => void;
  removeTimeEntry: (index: number) => void;

  // User settings
  updateSettings: (patch: Partial<UserSettings>) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [dayReport, setDayReport] = useState<DayReport>(mockDayReport);
  const [pomodoro] = useState<PomodoroState>({
    settings: mockPomodoroSettings,
    sessions: mockPomodoroSessions,
    stats: mockPomodoroStats,
  });
  const [settings, setSettings] = useState<UserSettings>(mockUserSettings);

  // ── Tasks ────────────────────────────────────────────────────────
  const toggleTask = useCallback((taskId: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
          : t,
      ),
    );
  }, []);

  const addTaskFull = useCallback(
    ({
      folderId,
      title,
      priority,
      comment,
      status,
    }: {
      folderId: number;
      title: string;
      priority: TaskPriority;
      comment: string;
      status: TaskStatus;
    }) => {
      const value = title.trim();
      if (!value) return;
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          folderId,
          title: value,
          tag: '',
          priority,
          status,
          time: '—',
          comment: comment.trim() || undefined,
        },
      ]);
    },
    [],
  );

  // ── Folders ──────────────────────────────────────────────────────
  const addFolder = useCallback(
    ({ name, color }: { name: string; color: string }) => {
      const value = name.trim();
      if (!value) return;
      setFolders((prev) => [
        ...prev,
        { id: Date.now(), name: value.toUpperCase(), color },
      ]);
    },
    [],
  );

  // ── Daily report ─────────────────────────────────────────────────
  const setActiveDay = useCallback((dayId: number) => {
    setDayReport((prev) => ({
      ...prev,
      recentDays: prev.recentDays.map((d) => ({ ...d, active: d.id === dayId })),
    }));
  }, []);

  const addDoneItem = useCallback((text: string) => {
    const value = text.trim();
    if (!value) return;
    setDayReport((prev) => ({ ...prev, done: [...prev.done, value] }));
  }, []);

  const removeDoneItem = useCallback((index: number) => {
    setDayReport((prev) => ({
      ...prev,
      done: prev.done.filter((_, i) => i !== index),
    }));
  }, []);

  const addNextTask = useCallback((title: string) => {
    const value = title.trim();
    if (!value) return;
    setDayReport((prev) => ({
      ...prev,
      next: [...prev.next, { id: Date.now(), title: value }],
    }));
  }, []);

  const removeNextTask = useCallback((id: number) => {
    setDayReport((prev) => ({
      ...prev,
      next: prev.next.filter((t) => t.id !== id),
    }));
  }, []);

  const promoteSuggested = useCallback((id: number) => {
    setDayReport((prev) => {
      const target = prev.next.find((t) => t.id === id);
      if (!target) return prev;
      const promoted: NextTask = { id: Date.now(), title: target.title };
      return { ...prev, next: [...prev.next, promoted] };
    });
  }, []);

  const updateNote = useCallback((note: string) => {
    setDayReport((prev) => ({ ...prev, note }));
  }, []);

  const updateValue = useCallback((value: string) => {
    setDayReport((prev) => ({ ...prev, value }));
  }, []);

  const removeTimeEntry = useCallback((index: number) => {
    setDayReport((prev) => ({
      ...prev,
      time: {
        ...prev.time,
        entries: prev.time.entries.filter((_, i) => i !== index),
      },
    }));
  }, []);

  // ── Settings ─────────────────────────────────────────────────────
  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // Apply accent color globally (matches legacy dashboard-app.jsx behavior)
  useEffect(() => {
    const root = document.documentElement;
    const c = settings.accentColor;
    root.style.setProperty('--pink', c);
    root.style.setProperty('--pink-lo', c + '18');
    root.style.setProperty('--pink-glow', c + '60');
    root.style.setProperty('--yn-pink', c);
    root.style.setProperty('--yn-pink-lo', c + '18');
    root.style.setProperty('--yn-pink-glow', c + '60');
    root.style.setProperty('--folder-accent', c);
    root.style.setProperty('--pomodoro-pink', c);
    root.style.setProperty('--settings-pink', c);
    root.style.setProperty('--daily-pink', c);
  }, [settings.accentColor]);

  const value = useMemo<AppContextValue>(
    () => ({
      folders,
      tasks,
      dayReport,
      pomodoro,
      settings,
      toggleTask,
      addTaskFull,
      addFolder,
      setActiveDay,
      addDoneItem,
      removeDoneItem,
      addNextTask,
      removeNextTask,
      promoteSuggested,
      updateNote,
      updateValue,
      removeTimeEntry,
      updateSettings,
    }),
    [
      folders,
      tasks,
      dayReport,
      pomodoro,
      settings,
      toggleTask,
      addTaskFull,
      addFolder,
      setActiveDay,
      addDoneItem,
      removeDoneItem,
      addNextTask,
      removeNextTask,
      promoteSuggested,
      updateNote,
      updateValue,
      removeTimeEntry,
      updateSettings,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
