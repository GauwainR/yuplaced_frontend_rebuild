import type { Task } from './types';

export const mockTasks: Task[] = [
  {
    id: 1,
    folderId: 1,
    title: 'Review frontend architecture',
    tag: 'frontend',
    priority: 'HIGH',
    status: 'todo',
    time: '45m',
  },
  {
    id: 2,
    folderId: 1,
    title: 'Prepare FastAPI task schema',
    tag: 'backend',
    priority: 'MED',
    status: 'in_progress',
    time: '1h 20m',
  },
  {
    id: 3,
    folderId: 1,
    title: 'Write daily insight prompt',
    tag: 'ai',
    priority: 'MED',
    status: 'done',
    time: '30m',
  },
  {
    id: 4,
    folderId: 2,
    title: 'Learn dnd-kit basics',
    tag: 'react',
    priority: 'LOW',
    status: 'todo',
    time: '40m',
  },
  {
    id: 5,
    folderId: 3,
    title: 'Plan evening routine',
    tag: 'life',
    priority: 'LOW',
    status: 'todo',
    time: '20m',
  },
];
