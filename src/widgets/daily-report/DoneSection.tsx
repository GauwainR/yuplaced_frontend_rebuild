import { useState, type KeyboardEvent } from 'react';
import { useApp } from '../../app/providers';

type Props = {
  items: string[];
};

export function DoneSection({ items }: Props) {
  const { addDoneItem, removeDoneItem } = useApp();
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);

  const submit = () => {
    if (!draft.trim()) {
      setAdding(false);
      return;
    }
    addDoneItem(draft);
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
    <section className="daily-report-panel daily-report-panel--done">
      <header className="daily-report-panel__header">
        <h2>DONE</h2>
        <button
          type="button"
          className="daily-report-panel__add"
          onClick={() => setAdding((v) => !v)}
          aria-label="Add a completed task"
        >
          +
        </button>
      </header>

      <div className="daily-report-list">
        {items.map((item, i) => (
          <div key={`${item}-${i}`} className="daily-report-check-row">
            <span className="daily-report-checkbox daily-report-checkbox--checked" />
            <span className="daily-report-check-row__text is-done">{item}</span>
            <button
              type="button"
              className="daily-report-row-del"
              onClick={() => removeDoneItem(i)}
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
            placeholder="Что выполнено?"
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
          Что выполнено?
        </button>
      )}
    </section>
  );
}
