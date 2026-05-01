import type { PomodoroSettings } from '../../entities/pomodoro/model/types';

type Props = {
  settings: PomodoroSettings;
};

export function SettingsPanel({ settings }: Props) {
  return (
    <section className="pomodoro-side-card">
      <h2>SETTINGS</h2>

      <div className="pomodoro-setting-row">
        <span>Work duration</span>
        <div>
          <button>-</button>
          <strong>{settings.workDuration} m</strong>
          <button>+</button>
        </div>
      </div>

      <div className="pomodoro-setting-row">
        <span>Break duration</span>
        <div>
          <button>-</button>
          <strong>{settings.breakDuration} m</strong>
          <button>+</button>
        </div>
      </div>

      <div className="pomodoro-setting-row">
        <span>Daily goal</span>
        <div>
          <button>-</button>
          <strong>{settings.dailyGoal}</strong>
          <button>+</button>
        </div>
      </div>
    </section>
  );
}
