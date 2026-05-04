import type { DayReport } from './types';

export const mockDayReport: DayReport = {
  recentDays: [
    { id: 1, label: 'APR 30', entries: 5, active: true },
    { id: 2, label: 'APR 29', entries: 3 },
    { id: 3, label: 'APR 28', entries: 7 },
    { id: 4, label: 'APR 27', entries: 4 },
    { id: 5, label: 'APR 26', entries: 2 },
    { id: 6, label: 'APR 25', entries: 8 },
  ],
  stats: {
    timeTracked: '47h 28m',
    tasksDone: 84,
    daysLogged: 18,
  },
  done: [
    { text: 'Настроить ESLint', ts: Date.now() - 7200000 },
    { text: 'Обновить зависимости', ts: Date.now() - 14400000 },
    { text: 'Ревью PR #14', ts: Date.now() - 14400000 },
  ],
  values: [
    'Разобрался с архитектурой middleware в Express.',
  ],
  time: {
    total: '4h 30m',
    entries: [
      { label: 'Deep work', duration: '3h 20m' },
      { label: 'Meetings', duration: '1h 10m' },
    ],
  },
  note: 'pgBouncer — соединения тормозят под нагрузкой.',
  next: [
    { id: 1, title: 'Задокументировать API' },
    { id: 2, title: 'Написать тесты' },
    { id: 3, title: 'Продолжить API docs', suggested: true },
    { id: 4, title: 'Написать unit-тесты', suggested: true },
    { id: 5, title: 'Обновить README', suggested: true },
  ],
};
