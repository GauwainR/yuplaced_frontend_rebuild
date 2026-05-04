import { useState, type KeyboardEvent } from 'react';
import { useApp } from '../../app/providers';
import type { DoneItem } from '../../entities/day-report/model/types';

type Props = {
  values: string[];
  doneItems: DoneItem[];
  open: boolean;
  onToggle: () => void;
};

const FALLBACK_INSIGHTS = [
  'Продуктивный день — каждая задача приближает к цели.',
  'Один шаг вперёд лучше десятка размышлений.',
  'Сегодня было сделано больше, чем кажется.',
  'Маленькие победы складываются в большой результат.',
  'Сосредоточенность сегодня — фундамент завтра.',
];

export function ValueSection({ values, doneItems, open, onToggle }: Props) {
  const { addValue, removeValue } = useApp();
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!draft.trim()) return;
    addValue(draft);
    setDraft('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    void doneItems;
    const next =
      FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
    addValue(next);
    setLoading(false);
  };

  const summary =
    values.length > 0
      ? `${values.length} insight${values.length > 1 ? 's' : ''}`
      : '—';

  return (
    <section className={`collapsible-section ${open ? 'expanded' : ''}`}>
      <header className="coll-header" onClick={onToggle}>
        <div className="coll-header__title">
          <span className="ds-label pink">VALUE</span>
          {!open && <span className="coll-summary">{summary}</span>}
        </div>
        <span className={`coll-chevron ${open ? 'open' : ''}`}>▾</span>
      </header>

      {open && (
        <div className="coll-body fade-in">
          {values.map((text, i) => (
            <div key={`${text}-${i}`} className="value-item">
              <span className="value-item__text">"{text}"</span>
              <button
                type="button"
                className="b-task__del"
                onClick={() => removeValue(i)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}

          <div className="add-row-s">
            <input
              className="add-inp"
              placeholder="Инсайт или ценность…"
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

          <button
            type="button"
            className="value-gen-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '…' : '⟳ GENERATE'}
          </button>
        </div>
      )}
    </section>
  );
}
