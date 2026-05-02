import { useApp } from '../../app/providers';
import type { DayReport } from '../../entities/day-report/model/types';

type Props = {
  recentDays: DayReport['recentDays'];
  stats: DayReport['stats'];
};

export function DailyReportSidebar({ recentDays, stats }: Props) {
  const { setActiveDay } = useApp();

  return (
    <aside className="daily-report-sidebar">
      <section className="daily-report-sidebar__section">
        <div className="daily-report-sidebar__title">RECENT DAYS</div>

        <div className="daily-report-days">
          {recentDays.length === 0 && (
            <div className="daily-report-empty">No days yet</div>
          )}

          {recentDays.map((day) => (
            <button
              key={day.id}
              type="button"
              className={`daily-report-day ${
                day.active ? 'daily-report-day--active' : ''
              }`}
              onClick={() => setActiveDay(day.id)}
            >
              <span>{day.label}</span>
              <span>{day.entries}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="daily-report-sidebar__section daily-report-sidebar__section--stats">
        <div className="daily-report-sidebar__title">ALL TIME</div>

        <div className="daily-report-stat">
          <span>Time tracked</span>
          <strong>{stats.timeTracked}</strong>
        </div>

        <div className="daily-report-stat">
          <span>Tasks done</span>
          <strong>{stats.tasksDone}</strong>
        </div>

        <div className="daily-report-stat">
          <span>Days logged</span>
          <strong>{stats.daysLogged}</strong>
        </div>
      </section>
    </aside>
  );
}
