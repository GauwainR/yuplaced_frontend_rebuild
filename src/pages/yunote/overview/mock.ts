import type { Folder } from '../../../entities/folder/model/types';
import type { Task } from '../../../entities/task/model/types';

export const todayFocusTasks: Task[] = [
  { id: 1, title: 'Finalize YUNOTE shell migration', status: 'done', priority: 'high', estimatedMinutes: 90, actualMinutes: 80, isTodayFocus: true },
  { id: 2, title: 'Review landing auth components', status: 'in_progress', priority: 'medium', estimatedMinutes: 45, isTodayFocus: true },
  { id: 3, title: 'Prepare API contracts for tasks', status: 'todo', priority: 'medium', estimatedMinutes: 60, isTodayFocus: true },
  { id: 4, title: 'Write notes for Daily Report UX', status: 'todo', priority: 'low', estimatedMinutes: 30, isTodayFocus: true },
];

export const folders: Folder[] = [
  { id: 1, name: 'WORK', description: 'Product, frontend and backend tasks.', color: '#e040a0', taskCount: 12, activeCount: 4 },
  { id: 2, name: 'STUDY', description: 'Learning, reading and practice.', color: '#58a6ff', taskCount: 7, activeCount: 2 },
  { id: 3, name: 'PERSONAL', description: 'Home, health and personal routines.', color: '#3fb950', taskCount: 5, activeCount: 1 },
  { id: 4, name: 'IDEAS', description: 'Product thoughts and future improvements.', color: '#bc8cff', taskCount: 9, activeCount: 3 },
];

export const activity = [
  { id: 1, text: 'Completed task', strong: 'YUNOTE shell migration', time: '10 min ago', color: '#3fb950' },
  { id: 2, text: 'Generated insight for', strong: 'today report', time: '28 min ago', color: '#e040a0' },
  { id: 3, text: 'Logged time in', strong: 'frontend refactor', time: '1h ago', color: '#ff9800' },
  { id: 4, text: 'Created folder', strong: 'IDEAS', time: 'yesterday', color: '#58a6ff' },
];

export const heatmap = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  level: [0, 1, 2, 3, 1, 4, 2, 0, 3, 2][index % 10],
}));
