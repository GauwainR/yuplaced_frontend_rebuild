import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockDayReport } from '../../entities/day-report/model/mockDayReport';
import { mockFolders } from '../../entities/folder/model/mockFolders';
import { mockTasks } from '../../entities/task/model/mockTasks';
import { mockPomodoroSettings, mockPomodoroSessions, mockPomodoroStats } from '../../entities/pomodoro/model/mockPomodoro';
import { mockUserSettings } from '../../entities/settings/model/mockSettings';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [folders] = useState(mockFolders);
  const [tasks, setTasks] = useState(mockTasks);
  const [dayReport, setDayReport] = useState(mockDayReport);
  const [pomodoro] = useState({
    settings: mockPomodoroSettings,
    sessions: mockPomodoroSessions,
    stats: mockPomodoroStats,
  });
  const [settings] = useState(mockUserSettings);

  const toggleTask = (taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status: t.status === 'done' ? 'open' : 'done' } : t
      )
    );
  };

  const updateNote = (note) => {
    setDayReport(prev => ({ ...prev, note }));
  };

  const updateValue = (value) => {
    setDayReport(prev => ({ ...prev, value }));
  };

  const value = useMemo(() => ({
    folders,
    tasks,
    dayReport,
    pomodoro,
    settings,
    toggleTask,
    updateNote,
    updateValue,
  }), [folders, tasks, dayReport, pomodoro, settings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}