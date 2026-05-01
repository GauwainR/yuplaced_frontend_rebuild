import { useState, type KeyboardEvent } from 'react';
import { useApp } from '../../app/providers';
import type { NextTask } from '../../entities/day-report/model/types';

type Props = {
  tasks: NextTask[];
};

export function NextTasksSection({ tasks }: Props) {
  const { addNextTask, removeNextTask, promoteSuggested } = useApp();
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);

  const regular = tasks.filter((t) => !t.suggested);
  const suggested = tasks.filter((t) => t.suggested);

  const submit = () => {
    if (!draft.trim()) {
      setAdding(false);
      return;
    }
    addNextTask(draft);
    setDraft('');
    setAdding(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') {
      setDraft('');
      setAdding(false);
    }
  };

  return (
    <section className="daily-report-panel daily-report-panel--next">
      <header className="daily-report-panel__header">
        <h2>NEXT TASKS</h2>
        <button
          type="button"
          className="daily-report-panel__add"
          onClick={() => setAdding((v) => !v)}
          aria-label="Add next task"
        >
          +
        </button>
      </header>

      <div className="daily-report-list">
        {regular.map((task) => (
          <div key={task.id} className="daily-report-check-row">
            <span className="daily-report-checkbox" />
            <span className="daily-report-check-row__text">{task.title}</span>
            <button
              type="button"
              className="daily-report-row-del"
              onClick={() => removeNextTask(task.id)}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="daily-report-add-row">
          <input
            autoFocus
            className="daily-report-add-input"
            placeholder="Что дальше?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submit}
            onKeyDown={handleKey}
          />
          <button
            type="button"
            className="daily-report-add-submit"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submit}
          >
            ↵
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="daily-report-inline-input"
          onClick={() => setAdding(true)}
        >
          Что дальше?
        </button>
      )}

      {suggested.length > 0 && (
        <div className="daily-report-suggested">
          <div className="daily-report-suggested__title">SUGGESTED</div>

          {suggested.map((task) => (
            <button
              key={task.id}
              type="button"
              className="daily-report-suggested__item"
              onClick={() => promoteSuggested(task.id)}
            >
              <span>→ {task.title}</span>
              <span>+</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}