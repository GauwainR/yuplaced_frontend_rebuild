type Props = {
  workMin: number;
  breakMin: number;
  dailyGoal: number;
  onWorkChange: (value: number) => void;
  onBreakChange: (value: number) => void;
  onDailyGoalChange: (value: number) => void;
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

export function SettingsPanel({
  workMin,
  breakMin,
  dailyGoal,
  onWorkChange,
  onBreakChange,
  onDailyGoalChange,
}: Props) {
  return (
    <section className="pomodoro-side-card">
      <h2>SETTINGS</h2>

      <div className="pomodoro-setting-row">
        <span>Work duration</span>
        <div className="pomodoro-stepper">
          <button type="button" onClick={() => onWorkChange(clamp(workMin - 1, 1, 90))}>
            −
          </button>
          <strong>{workMin} m</strong>
          <button type="button" onClick={() => onWorkChange(clamp(workMin + 1, 1, 90))}>
            +
          </button>
        </div>
      </div>

      <div className="pomodoro-setting-row">
        <span>Break duration</span>
        <div className="pomodoro-stepper">
          <button type="button" onClick={() => onBreakChange(clamp(breakMin - 1, 1, 30))}>
            −
          </button>
          <strong>{breakMin} m</strong>
          <button type="button" onClick={() => onBreakChange(clamp(breakMin + 1, 1, 30))}>
            +
          </button>
        </div>
      </div>

      <div className="pomodoro-setting-row">
        <span>Daily goal</span>
        <div className="pomodoro-stepper">
          <button
            type="button"
            onClick={() => onDailyGoalChange(clamp(dailyGoal - 1, 1, 12))}
          >
            −
          </button>
          <strong>{dailyGoal}</strong>
          <button
            type="button"
            onClick={() => onDailyGoalChange(clamp(dailyGoal + 1, 1, 12))}
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}