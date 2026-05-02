import { Badge } from '../../shared/ui/badge';
import type { Task } from '../../entities/task/model/types';

type TodayFocusProps = {
  tasks: Task[];
  onToggleTask?: (taskId: number) => void;
};

function priorityLabel(priority: Task['priority']) {
  return priority === 'medium' ? 'MED' : priority.toUpperCase();
}

function priorityTone(priority: Task['priority']) {
  if (priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  return 'low';
}

export function TodayFocus({ tasks, onToggleTask }: TodayFocusProps) {
  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const openCount = tasks.length - doneCount;

  return (
    <section className="yn-focus-block">
      {/* Шапка секции */}
      <div className="yn-section-title-row">
        <h2 className="yn-section-title">TODAY FOCUS</h2>
        <div className="yn-section-muted">
          {openCount} open &middot; {doneCount} done
        </div>
      </div>

      {/* Список задач */}
      <div className="yn-focus-list">
        {tasks.length === 0 ? (
          <div className="yn-focus-empty">
            Нет задач на сегодня
          </div>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === 'done';

            return (
              <div className="yn-focus-task" key={task.id}>
                {/* Кликабельный чекбокс */}
                <button
                  type="button"
                  aria-label={isDone ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
                  className={`yn-focus-check ${isDone ? 'done' : ''}`}
                  onClick={() => onToggleTask?.(task.id)}
                >
                  {isDone && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                
                {/* Название задачи */}
                <span className={`yn-focus-task-title ${isDone ? 'done' : ''}`}>
                  {task.title}
                </span>
                
                {/* Бейдж приоритета */}
                <div className="yn-focus-task-badge">
                  <Badge tone={priorityTone(task.priority)}>
                    {priorityLabel(task.priority)}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}