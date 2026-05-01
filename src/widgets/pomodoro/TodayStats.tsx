import type { PomodoroStats } from '../../entities/pomodoro/model/types';

type Props = {
  stats: PomodoroStats;
};

export function TodayStats({ stats }: Props) {
  return (
    <section className="pomodoro-side-card">
      <h2>TODAY</h2>

      <div className="pomodoro-stat-row">
        <span>Sessions</span>
        <strong>{stats.sessions}</strong>
      </div>

      <div className="pomodoro-stat-row">
        <span>Focus time</span>
        <strong className="pomodoro-stat-row__orange">{stats.focusTime}</strong>
      </div>

      <div className="pomodoro-stat-row">
        <span>Streak</span>
        <strong className="pomodoro-stat-row__green">{stats.streak}</strong>
      </div>
    </section>
  );
}