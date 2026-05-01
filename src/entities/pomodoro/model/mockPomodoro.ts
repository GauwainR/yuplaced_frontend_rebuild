import type { PomodoroSession, PomodoroSettings, PomodoroStats } from './types';

export const mockPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  dailyGoal: 4,
};

export const mockPomodoroSessions: PomodoroSession[] = [
  { id: 1, title: 'Deep work — yuplaced', type: 'focus', duration: '25:00' },
  { id: 2, title: 'Short break', type: 'break', duration: '05:00' },
  { id: 3, title: 'Deep work — refactor', type: 'focus', duration: '25:00' },
];

export const mockPomodoroStats: PomodoroStats = {
  sessions: '0/4',
  focusTime: '0m',
  streak: '5 days',
};
