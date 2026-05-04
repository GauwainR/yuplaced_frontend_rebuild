import { useMemo, useState, type KeyboardEvent } from 'react';
import { useApp } from '../../app/providers';
import type { DoneItem } from '../../entities/day-report/model/types';

type Props = {
  items: DoneItem[];
};

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function DoneSection({ items }: Props) {
  const { tasks, toggleTask, addDoneItem, removeDoneItem } = useApp();
  const [draft, setDraft] = useState('');

  const doneTasks = useMemo(
    () => tasks.filter((t) => t.status === 'done'),
    [tasks],
  );

  const totalDone = doneTasks.length + items.length;
  const totalTasks = tasks.length;
  const progressPct =
    totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const submit = () => {
    if (!draft.trim()) return;
    addDoneItem(draft);
    setDraft('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <section className="done-section">
      <header className="done-header">
        <span className="done-header__label">DONE</span>
        <span className="done-header__count">{totalDone} tasks</span>
      </header>

      {/* Progress bar */}
      <div className="done-progress">
        <div
          className="done-progress__bar"
          style={{ width: `${Math.min(progressPct, 100)}%` }}
        />
      </div>

      <div className="done-list">
        {/* Folder tasks */}
        {doneTasks.map((task) => (
          <div key={`folder-${task.id}`} className="done-row">
            <span className="done-row__check">✓</span>
            <span className="done-row__text">{task.title}</span>
            <span className="done-row__time">
              {task.completedAt ? fmtTime(task.completedAt) : '—'}
            </span>
            <button
              type="button"
              className="done-row__del"
              onClick={() => toggleTask(task.id)}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}

        {/* Manual entries */}
        {items.map((item, i) => (
          <div key={`manual-${item.text}-${i}`} className="done-row">
            <span className="done-row__check">✓</span>
            <span className="done-row__text">{item.text}</span>
            <span className="done-row__time">{fmtTime(item.ts)}</span>
            <button
              type="button"
              className="done-row__del"
              onClick={() => removeDoneItem(i)}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add input */}
        <div className="done-add">
          <span className="done-add__hint">Что выполнено?</span>
          <input
            className="done-add__input"
            placeholder="[add_done_accomplishment: "
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            type="button"
            className="done-add__submit"
            onClick={submit}
            aria-label="Add"
          >
            ↵
          </button>
        </div>
      </div>
    </section>
  );
}
