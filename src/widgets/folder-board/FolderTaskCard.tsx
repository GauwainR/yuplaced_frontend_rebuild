
import { useState } from 'react';
import { useApp } from '../../app/providers';

export function FolderTaskCard({ task }) {
  const { toggleTask } = useApp();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  return (
    <div className={`folder-task-card ${task.status === 'done' ? 'is-done' : ''}`}>
      <div
        className="folder-task-card__checkbox"
        onClick={() => toggleTask(task.id)}
      >
        {task.status === 'done' ? '✓' : ''}
      </div>

      <div className="folder-task-card__content">
        {editing ? (
          <input
            className="folder-task-card__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditing(false)}
            autoFocus
          />
        ) : (
          <div
            className="folder-task-card__title"
            onDoubleClick={() => setEditing(true)}
          >
            {title}
          </div>
        )}

        <div className="folder-task-card__meta">
          {task.tag && <span className="tag">{task.tag}</span>}
          {task.priority && <span className="priority">{task.priority}</span>}
          {task.time && <span className="time">{task.time}</span>}
        </div>
      </div>
    </div>
  );
}