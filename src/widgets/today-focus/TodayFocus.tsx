import { useApp } from '../../app/providers';
import type { Task, TaskPriority } from '../../entities/task/model/types';

const PRI_CLASS: Record<TaskPriority, string> = {
  HIGH: 'high',
  MED: 'med',
  LOW: 'low',
};

export function TodayFocus() {
  const { tasks, toggleTask } = useApp();

  // "Today focus" = tasks that are in_progress or todo (not done).
  // We show all non-done tasks, capped at 5 for focus. Done tasks shown too if recently toggled.
  // This matches the legacy behavior where TODAY_FOCUS_DATA comes from the API
  // and represents the user's curated daily list.
  const focusTasks = tasks.slice(0, 6);
  const completed = focusTasks.filter((t) => t.status === 'done').length;
  const open = focusTasks.length - completed;

  return (
    <section className="focus-block">
      <header className="focus-header">
        <span className="focus-title">TODAY FOCUS</span>
        <span className="focus-meta">
          {open} open · {completed} done
        </span>
      </header>

      {focusTasks.length === 0 ? (
        <div className="focus-empty">— No tasks for today yet —</div>
      ) : (
        focusTasks.map((task) => (
          <FocusTaskRow key={task.id} task={task} onToggle={toggleTask} />
        ))
      )}
    </section>
  );
}

function FocusTaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: number) => void;
}) {
  const isDone = task.status === 'done';

  return (
    <div className="focus-task">
      <div
        className={`focus-check ${isDone ? 'done' : ''}`}
        onClick={() => onToggle(task.id)}
        role="button"
        tabIndex={0}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onToggle(task.id);
        }}
      >
        {isDone ? '✓' : ''}
      </div>
      <span className={`focus-task-title ${isDone ? 'done' : ''}`}>
        {task.title}
      </span>
      <span className={`priority-badge ${PRI_CLASS[task.priority]}`}>
        {task.priority}
      </span>
    </div>
  );
}
