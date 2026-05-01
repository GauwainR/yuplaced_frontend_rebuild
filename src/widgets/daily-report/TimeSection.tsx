import { useApp } from '../../app/providers';
import type { DayReport } from '../../entities/day-report/model/types';

type Props = {
  time: DayReport['time'];
};

export function TimeSection({ time }: Props) {
  const { removeTimeEntry } = useApp();

  const handleRemove = (index: number) => {
    if (window.confirm('Remove this entry?')) {
      removeTimeEntry(index);
    }
  };

  return (
    <section className="daily-report-panel daily-report-panel--time">
      <header className="daily-report-panel__header">
        <h2>TIME</h2>
        <span className="daily-report-panel__hint">{time.total}</span>
      </header>

      <div className="daily-report-time-total">{time.total}</div>

      <div className="daily-report-time-list">
        {time.entries.length === 0 && (
          <div className="daily-report-empty">No time entries yet</div>
        )}

        {time.entries.map((entry, i) => (
          <button
            key={`${entry.label}-${i}`}
            type="button"
            className="daily-report-time-row"
            onClick={() => handleRemove(i)}
            title="Click to remove"
          >
            <span>{entry.label}</span>
            <strong>{entry.duration}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}