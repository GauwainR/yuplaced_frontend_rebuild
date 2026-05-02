import { useState, type KeyboardEvent } from 'react';
import { useApp } from '../../app/providers';

type Props = {
  items: string[];
};

export function DoneSection({ items }: Props) {
  const { addDoneItem, removeDoneItem } = useApp();
  const [draft, setDraft] = useState('');

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
      <header className="ds-header">
        <span className="ds-label green">DONE</span>
        <span className="ds-meta">{items.length} tasks</span>
      </header>

      <div className="ds-body">
        {items.map((text, i) => (
          <div key={`${text}-${i}`} className="b-task">
            <div className="b-check on" aria-hidden>
              ✓
            </div>
            <span className="b-text striked">{text}</span>
            <button
              type="button"
              className="b-task__del"
              onClick={() => removeDoneItem(i)}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}

        <div className="add-row-s">
          <input
            className="add-inp"
            placeholder="Что выполнено?"
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
      </div>
    </section>
  );
}
