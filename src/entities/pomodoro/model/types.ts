export type PomodoroSession = {
  id: number;
  title: string;
  type: 'focus' | 'break';
  duration: string;
};

export type PomodoroSettings = {
  workDuration: number;
  breakDuration: number;
  dailyGoal: number;
};

export type PomodoroStats = {
  sessions: string;
  focusTime: string;
  streak: string;
};
