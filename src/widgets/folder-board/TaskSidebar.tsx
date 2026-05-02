import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Folder } from '../../entities/folder/model/types';
import type {
  Task,
  TaskLogEntry,
  TaskPriority,
  TaskStatus,
} from '../../entities/task/model/types';

type Props = {
  task: Task;
  folder?: Folder;
  onClose: () => void;
  onUpdate: (updated: Task) => void;
};

const PRI_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'HIGH', label: 'HIGH', color: '#f85149' },
  { value: 'MED', label: 'MED', color: '#ff9800' },
  { value: 'LOW', label: 'LOW', color: '#58a6ff' },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'TO DO', color: 'var(--folder-muted, #7d8590)' },
  { value: 'in_progress', label: 'IN PROGRESS', color: '#ff9800' },
  { value: 'done', label: 'DONE', color: '#3fb950' },
];

function fmtTime(ts: number): string {
  const d = new Date(ts);
  return (
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
    ' · ' +
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
}

export function TaskSidebar({ task, folder, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(task.title);
  const [pri, setPri] = useState<TaskPriority>(task.priority);
  const [comment, setComment] = useState(task.comment ?? '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [log, setLog] = useState<TaskLogEntry[]>(task.log ?? []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSave = () => {
    const changes: string[] = [];
    if (title !== task.title) changes.push(`Title: "${task.title}" → "${title}"`);
    if (pri !== task.priority) changes.push(`Priority: ${task.priority} → ${pri}`);
    if (status !== task.status) {
      const sl = (s: TaskStatus) =>
        STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
      changes.push(`Status: ${sl(task.status)} → ${sl(status)}`);
    }
    if (comment !== (task.comment ?? '')) changes.push('Comment updated');

    const newLog: TaskLogEntry[] = changes.length
      ? [{ ts: Date.now(), msg: changes.join(' · ') }, ...log]
      : log;

    onUpdate({
      ...task,
      title: title.trim() || task.title,
      priority: pri,
      status,
      comment: comment.trim() || undefined,
      log: newLog,
    });
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="task-sidebar-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="task-sidebar">
        {/* Header */}
        <header className="task-sidebar__header">
          <div className="task-sidebar__header-left">
            {folder && (
              <span
                className="task-sidebar__dot"
                style={{
                  backgroundColor: folder.color,
                  boxShadow: `0 0 6px ${folder.color}`,
                }}
              />
            )}
            <span className="task-sidebar__folder-name">
              {folder?.name ?? 'TASK'}
            </span>
          </div>
          <button
            type="button"
            className="task-sidebar__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        {/* Scrollable body */}
        <div className="task-sidebar__body">
          {/* Title */}
          <div className="task-sidebar__field">
            <div className="task-sidebar__label">TITLE</div>
            <input
              className="task-sidebar__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Priority */}
          <div className="task-sidebar__field">
            <div className="task-sidebar__label">PRIORITY</div>
            <div className="task-sidebar__btn-row">
              {PRI_OPTIONS.map((p) => {
                const active = pri === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    className={`task-sidebar__opt ${active ? 'is-active' : ''}`}
                    onClick={() => setPri(p.value)}
                    style={
                      active
                        ? {
                            background: `${p.color}18`,
                            borderColor: p.color,
                            color: p.color,
                          }
                        : undefined
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="task-sidebar__field">
            <div className="task-sidebar__label">STATUS</div>
            <div className="task-sidebar__btn-row">
              {STATUS_OPTIONS.map((s) => {
                const active = status === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    className={`task-sidebar__opt ${active ? 'is-active' : ''}`}
                    onClick={() => setStatus(s.value)}
                    style={
                      active
                        ? {
                            background: `${s.color}18`,
                            borderColor: s.color,
                            color: s.color,
                          }
                        : undefined
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="task-sidebar__field">
            <div className="task-sidebar__label">COMMENT</div>
            <textarea
              className="task-sidebar__textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Notes, context, links…"
              rows={4}
            />
          </div>

          {/* Divider */}
          <div className="task-sidebar__divider" />

          {/* Change log */}
          <div className="task-sidebar__field">
            <div className="task-sidebar__label">CHANGE LOG</div>

            {log.length === 0 ? (
              <div className="task-sidebar__log-empty">No changes yet</div>
            ) : (
              log.map((entry, i) => (
                <div
                  key={`${entry.ts}-${i}`}
                  className="task-sidebar__log-entry"
                >
                  <div className="task-sidebar__log-line" />
                  <div>
                    <div className="task-sidebar__log-msg">{entry.msg}</div>
                    <div className="task-sidebar__log-time">
                      {fmtTime(entry.ts)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="task-sidebar__footer">
          <button
            type="button"
            className="task-sidebar__btn-cancel"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="task-sidebar__btn-save"
            onClick={handleSave}
          >
            SAVE CHANGES
          </button>
        </footer>
      </div>
    </>,
    document.body,
  );
}
