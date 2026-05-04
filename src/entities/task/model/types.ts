export type TaskPriority = 'LOW' | 'MED' | 'HIGH';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskLogEntry = {
  ts: number;
  msg: string;
};

export type Task = {
  id: number;
  folderId: number;
  title: string;
  tag: string;
  priority: TaskPriority;
  status: TaskStatus;
  trackedMin: number;
  comment?: string;
  log?: TaskLogEntry[];
  completedAt?: number;
};

/** Format tracked minutes for display: "0m", "45m", "1h 20m" */
export function fmtTracked(min: number): string {
  if (min <= 0) return '0m';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
