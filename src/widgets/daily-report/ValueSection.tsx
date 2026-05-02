import { useState } from 'react';
import { useApp } from '../../app/providers';

type Props = {
  value: string;
  doneItems: string[];
};

const FALLBACK_INSIGHTS = [
  'Продуктивный день — каждая задача приближает к цели.',
  'Один шаг вперёд лучше десятка размышлений.',
  'Сегодня было сделано больше, чем кажется.',
  'Маленькие победы складываются в большой результат.',
  'Сосредоточенность сегодня — фундамент завтра.',
];

export function ValueSection({ value, doneItems }: Props) {
  const { updateValue } = useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Legacy uses window.claude.complete to generate an AI insight from doneItems.
  // That API is not available outside the dashboard sandbox, so we use a local
  // fallback rotation. When backend wiring lands, swap this for a fetch().
  const handleGenerate = async () => {
    setLoading(true);
    setEditing(false);
    await new Promise((resolve) => setTimeout(resolve, 350));
    // doneItems will be used by the real backend prompt — referenced here so
    // the parameter is not flagged as unused once you wire the real call.
    void doneItems;
    const next =
      FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
    updateValue(next);
    setLoading(false);
  };

  return (
    <section className="value-section">
      <header className="ds-header">
        <span className="ds-label pink">VALUE</span>
        <span className="ds-meta">автоматически</span>
      </header>

      {!editing ? (
        <div className={`value-insight fade-in ${loading ? 'loading' : ''}`}>
          {loading ? 'генерация…' : value ? `"${value}"` : '—'}
        </div>
      ) : (
        <textarea
          className="value-edit-area"
          rows={3}
          value={value}
          onChange={(e) => updateValue(e.target.value)}
          autoFocus
        />
      )}

      <div className="value-actions">
        <button
          type="button"
          className="value-btn gen"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '…' : '⟳ GENERATE'}
        </button>
        <button
          type="button"
          className="value-btn"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? 'SAVE' : 'EDIT'}
        </button>
      </div>
    </section>
  );
}
