import { useState } from 'react';
import { useApp } from '../../app/providers';
import { CompleteTaskModal } from '../folder-board/CompleteTaskModal';
import type { Task, TaskPriority } from '../../entities/task/model/types';

const PRI_CLASS: Record<TaskPriority, string> = {
  HIGH: 'high',
  MED: 'med',
  LOW: 'low',
};

export function TodayFocus() {
  const { tasks, toggleTask, addTimeToTask, addValue } = useApp();

  const [pendingTask, setPendingTask] = useState<Task | null>(null);

  const focusTasks = tasks.slice(0, 6);
  const completed = focusTasks.filter((t) => t.status === 'done').length;
  const open = focusTasks.length - completed;

  const handleToggle = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status !== 'done') {
      // Going to done → show modal
      setPendingTask(task);
    } else {
      // Un-doing
      toggleTask(taskId);
    }
  };

  const handleComplete = (data: { minutes: number; value: string }) => {
    if (!pendingTask) return;
    toggleTask(pendingTask.id);
    if (data.minutes > 0) addTimeToTask(pendingTask.id, data.minutes);
    if (data.value) addValue(data.value);
    setPendingTask(null);
  };

  const handleSkip = () => {
    if (pendingTask) toggleTask(pendingTask.id);
    setPendingTask(null);
  };

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
          <FocusTaskRow key={task.id} task={task} onToggle={handleToggle} />
        ))
      )}

      {pendingTask && (
        <CompleteTaskModal
          task={pendingTask}
          onSubmit={handleComplete}
          onSkip={handleSkip}
        />
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
