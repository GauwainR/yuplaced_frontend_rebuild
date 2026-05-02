import { useApp } from '../../app/providers';
import type { DayReport } from '../../entities/day-report/model/types';

type Props = {
  recentDays: DayReport['recentDays'];
  stats: DayReport['stats'];
};

export function DailyReportSidebar({ recentDays, stats }: Props) {
  const { setActiveDay } = useApp();

  // Track which row is "today" so we can show the legacy ● dot.
  // The mock marks the latest entry as active by default; treat that as "today".
  const todayId = recentDays.find((d) => d.active)?.id;

  return (
    <aside className="daily-sidebar">
      <section className="daily-sidebar-section">
        <div className="daily-sidebar-label">RECENT DAYS</div>

        {recentDays.length === 0 && (
          <div className="daily-sidebar-empty">No days yet</div>
        )}

        {recentDays.map((day) => {
          const isActive = day.active === true;
          const isToday = day.id === todayId;
          return (
            <button
              key={day.id}
              type="button"
              className={`day-item-ob ${isActive ? 'active' : ''}`}
              onClick={() => setActiveDay(day.id)}
            >
              <span className="dn">
                {day.label}
                {isToday && <span className="day-item-ob__today-dot">●</span>}
              </span>
              <span className="dc">{day.entries}</span>
            </button>
          );
        })}
      </section>

      <section className="daily-sidebar-section">
        <div className="daily-sidebar-label">ALL TIME</div>

        <div className="obs-stat">
          <span className="obs-stat-l">Time tracked</span>
          <span className="obs-stat-v">{stats.timeTracked}</span>
        </div>
        <div className="obs-stat">
          <span className="obs-stat-l">Tasks done</span>
          <span className="obs-stat-v">{stats.tasksDone}</span>
        </div>
        <div className="obs-stat">
          <span className="obs-stat-l">Days logged</span>
          <span className="obs-stat-v">{stats.daysLogged}</span>
        </div>
      </section>
    </aside>
  );
}
