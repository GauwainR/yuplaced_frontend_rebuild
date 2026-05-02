import { useState, type KeyboardEvent } from 'react';
import { useApp } from '../../app/providers';
import type { NextTask } from '../../entities/day-report/model/types';

type Props = {
  tasks: NextTask[];
  open: boolean;
  onToggle: () => void;
};

export function NextTasksSection({ tasks, open, onToggle }: Props) {
  const { addNextTask, removeNextTask, promoteSuggested } = useApp();
  const [draft, setDraft] = useState('');

  const regular = tasks.filter((t) => !t.suggested);
  const suggested = tasks.filter((t) => t.suggested);

  const submit = () => {
    if (!draft.trim()) return;
    addNextTask(draft);
    setDraft('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <section className={`collapsible-section ${open ? 'expanded' : ''}`}>
      <header className="coll-header" onClick={onToggle}>
        <div className="coll-header__title">
          <span className="ds-label purple">NEXT</span>
          {!open && (
            <span className="coll-summary">{regular.length} planned</span>
          )}
        </div>
        <span className={`coll-chevron ${open ? 'open' : ''}`}>▾</span>
      </header>

      {open && (
        <div className="coll-body fade-in">
          {regular.map((task) => (
            <div key={task.id} className="b-task">
              <div className="b-check" aria-hidden />
              <span className="b-text">{task.title}</span>
              <button
                type="button"
                className="b-task__del"
                onClick={() => removeNextTask(task.id)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}

          <div className="add-row-s">
            <input
              className="add-inp"
              placeholder="Что дальше?"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              type="button"
              className="add-sub"
              onClick={submit}
              aria-label="Add"
            >
              ↵
            </button>
          </div>

          {suggested.length > 0 && (
            <div className="suggested-block">
              <div className="suggested-label">SUGGESTED</div>

              {suggested.map((task) => (
                <div key={task.id} className="suggested-item">
                  <span className="suggested-item__arrow">→</span>
                  <span className="suggested-item__text">{task.title}</span>
                  <button
                    type="button"
                    className="suggested-item__add"
                    onClick={() => promoteSuggested(task.id)}
                    aria-label="Add to next"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
