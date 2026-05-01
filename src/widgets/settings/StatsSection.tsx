import type { UserSettings } from '../../entities/settings/model/types';

type Props = {
  settings: UserSettings;
};

export function StatsSection({ settings }: Props) {
  return (
    <section className="settings-card">
      <h2>STATISTICS</h2>

      <div className="settings-stats-grid">
        <div>
          <span>Tasks done</span>
          <strong>{settings.statistics.tasksDone}</strong>
        </div>

        <div>
          <span>Time tracked</span>
          <strong>{settings.statistics.timeTracked}</strong>
        </div>

        <div>
          <span>Days logged</span>
          <strong>{settings.statistics.daysLogged}</strong>
        </div>

        <div>
          <span>Streak</span>
          <strong>{settings.statistics.streak}</strong>
        </div>
      </div>
    </section>
  );
}
