export type TaskPriority = 'LOW' | 'MED' | 'HIGH';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type Task = {
  id: number;
  folderId: number;
  title: string;
  tag: string;
  priority: TaskPriority;
  status: TaskStatus;
  time: string;
  comment?: string;
};
