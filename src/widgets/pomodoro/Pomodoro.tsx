import { useApp } from '../../app/providers';
import { Controls } from './Controls';
import { SessionLog } from './SessionLog';
import { SessionProgress } from './SessionProgress';
import { SettingsPanel } from './SettingsPanel';
import { Timer } from './Timer';
import { TodayStats } from './TodayStats';

export function Pomodoro() {
  const { pomodoro } = useApp();

  return (
    <div className="pomodoro-shell">
      <main className="pomodoro-main">
        <Timer />
        <Controls />
        <SessionProgress />
      </main>

      <aside className="pomodoro-sidebar">
        <SettingsPanel settings={pomodoro.settings} />
        <SessionLog sessions={pomodoro.sessions} />
        <TodayStats stats={pomodoro.stats} />
      </aside>
    </div>
  );
}
