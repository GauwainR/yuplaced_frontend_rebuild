import { useState } from 'react';
import { useApp } from '../../app/providers';

type Props = {
  value: string;
};

const FALLBACK_INSIGHTS = [
  'Продуктивный день — каждая задача приближает к цели.',
  'Один шаг вперёд — лучше десятка размышлений.',
  'Сегодня было сделано больше, чем кажется.',
  'Маленькие победы складываются в большой результат.',
  'Сосредоточенность сегодня — фундамент завтра.',
];

export function ValueSection({ value }: Props) {
  const { updateValue } = useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setEditing(false);
    // Backend AI insight endpoint is not wired yet — use fallback rotation.
    // Replace this with a fetch() to your backend when the endpoint is ready.
    await new Promise((resolve) => setTimeout(resolve, 350));
    const next =
      FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
    updateValue(next);
    setLoading(false);
  };

  return (
    <section className="daily-report-panel daily-report-panel--value">
      <header className="daily-report-panel__header">
        <h2>VALUE</h2>
        <span className="daily-report-panel__hint">автоматически</span>
      </header>

      {!editing ? (
        <p className={`daily-report-value ${loading ? 'is-loading' : ''}`}>
          {loading ? 'генерация…' : value ? `"${value}"` : '—'}
        </p>
      ) : (
        <textarea
          className="daily-report-value-edit"
          rows={3}
          value={value}
          onChange={(e) => updateValue(e.target.value)}
          autoFocus
        />
      )}

      <div className="daily-report-actions">
        <button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? '…' : '⟳ GENERATE'}
        </button>
        <button type="button" onClick={() => setEditing((v) => !v)}>
          {editing ? 'SAVE' : 'EDIT'}
        </button>
      </div>
    </section>
  );
}
