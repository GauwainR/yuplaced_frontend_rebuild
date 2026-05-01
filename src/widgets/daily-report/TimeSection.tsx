import type { DayReport } from '../../entities/day-report/model/types';

type Props = {
  time: DayReport['time'];
};

export function TimeSection({ time }: Props) {
  return (
    <section className="daily-report-panel daily-report-panel--time">
      <header className="daily-report-panel__header">
        <h2>TIME</h2>
        <button type="button">⌄</button>
      </header>

      <div className="daily-report-time-total">{time.total}</div>

      <div className="daily-report-time-list">
        {time.entries.map((entry) => (
          <div key={entry.label} className="daily-report-time-row">
            <span>{entry.label}</span>
            <strong>{entry.duration}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
