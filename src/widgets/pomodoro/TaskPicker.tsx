import { useRef, useState, useEffect } from 'react';
import type { Folder } from '../../entities/folder/model/types';
import type { Task } from '../../entities/task/model/types';

type Props = {
  tasks: Task[];
  folders: Folder[];
  selectedTaskId: number | null;
  onSelect: (taskId: number | null) => void;
  disabled?: boolean;
};

export function TaskPicker({
  tasks,
  folders,
  selectedTaskId,
  onSelect,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selected = tasks.find((t) => t.id === selectedTaskId);
  const selectedFolder = selected
    ? folders.find((f) => f.id === selected.folderId)
    : null;

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (tasks.length === 0) {
    return (
      <div className="pomo-task-picker pomo-task-picker--empty">
        <span className="pomo-task-picker__icon">○</span>
        <span className="pomo-task-picker__hint">
          No in-progress tasks — start a free session
        </span>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`pomo-task-picker ${disabled ? 'is-disabled' : ''}`}
    >
      <button
        type="button"
        className="pomo-task-picker__trigger"
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedFolder && (
          <span
            className="pomo-task-picker__dot"
            style={{ backgroundColor: selectedFolder.color }}
          />
        )}
        <span className="pomo-task-picker__title">
          {selected ? selected.title : 'Select task…'}
        </span>
        <span className={`pomo-task-picker__chevron ${open ? 'is-open' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="pomo-task-picker__dropdown" role="listbox">
          {/* Unlink option */}
          <button
            type="button"
            className={`pomo-task-picker__option ${
              selectedTaskId === null ? 'is-active' : ''
            }`}
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
            role="option"
            aria-selected={selectedTaskId === null}
          >
            <span className="pomo-task-picker__dot" style={{ background: '#444' }} />
            <span className="pomo-task-picker__option-text">
              Free session (no task)
            </span>
          </button>

          {tasks.map((t) => {
            const folder = folders.find((f) => f.id === t.folderId);
            const isActive = t.id === selectedTaskId;
            return (
              <button
                key={t.id}
                type="button"
                className={`pomo-task-picker__option ${
                  isActive ? 'is-active' : ''
                }`}
                onClick={() => {
                  onSelect(t.id);
                  setOpen(false);
                }}
                role="option"
                aria-selected={isActive}
              >
                {folder && (
                  <span
                    className="pomo-task-picker__dot"
                    style={{ backgroundColor: folder.color }}
                  />
                )}
                <span className="pomo-task-picker__option-text">{t.title}</span>
                {isActive && (
                  <span className="pomo-task-picker__check">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
