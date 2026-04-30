import { Badge } from '../../shared/ui/badge';
import type { Task } from '../../entities/task/model/types';

type TodayFocusProps = {
  tasks: Task[];
};

function priorityLabel(priority: Task['priority']) {
  return priority === 'medium' ? 'MED' : priority.toUpperCase();
}

function priorityTone(priority: Task['priority']) {
  if (priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  return 'low';
}

export function TodayFocus({ tasks }: TodayFocusProps) {
  const completed = tasks.filter((task) => task.status === 'done').length;

  return (
    <section className="yn-focus-block">
      <div className="yn-focus-header">
        <div>
          <div className="yn-focus-title">TODAY FOCUS</div>
          <div className="yn-focus-sub">Keep the day focused on 3–5 tasks.</div>
        </div>
        <div className="yn-focus-meta">{completed}/{tasks.length} DONE</div>
      </div>

      <div className="yn-focus-list">
        {tasks.map((task) => (
          <div className="yn-focus-task" key={task.id}>
            <span className={task.status === 'done' ? 'yn-focus-check done' : 'yn-focus-check'}>
              {task.status === 'done' ? '✓' : ''}
            </span>
            <span className={task.status === 'done' ? 'yn-focus-task-title done' : 'yn-focus-task-title'}>
              {task.title}
            </span>
            {task.estimatedMinutes && <span className="yn-task-time">⏱ {task.estimatedMinutes}m</span>}
            <Badge tone={priorityTone(task.priority)}>{priorityLabel(task.priority)}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
