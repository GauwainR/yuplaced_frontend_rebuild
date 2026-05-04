import { useApp } from '../../app/providers';
import type { Task } from '../../entities/task/model/types';
import { fmtTracked } from '../../entities/task/model/types';

type Props = {
  task: Task;
  folderColor?: string;
};

export function FolderTaskCard({ task, folderColor }: Props) {
  const { toggleTask } = useApp();
  const isDone = task.status === 'done';

  return (
    <article
      className={`folder-task-card ${isDone ? 'folder-task-card--done' : ''}`}
      style={folderColor ? { borderLeftColor: folderColor } : undefined}
    >
      <button
        type="button"
        className={`folder-task-card__checkbox ${isDone ? 'is-checked' : ''}`}
        onClick={() => toggleTask(task.id)}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
      >
        {isDone ? '✓' : ''}
      </button>

      <div className="folder-task-card__content">
        <div className="folder-task-card__title">{task.title}</div>

        <div className="folder-task-card__meta">
          {task.tag && <span className="folder-board-tag">{task.tag}</span>}
          {task.priority && (
            <span
              className={`folder-board-priority folder-board-priority--${task.priority.toLowerCase()}`}
            >
              {task.priority}
            </span>
          )}
          {task.trackedMin > 0 && (
            <span className="folder-board-time">⏱ {fmtTracked(task.trackedMin)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
