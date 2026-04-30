export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  folderId?: number;
  estimatedMinutes?: number;
  actualMinutes?: number;
  isTodayFocus?: boolean;
}
