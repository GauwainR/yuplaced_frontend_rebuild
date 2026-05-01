type Props = {
  running: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onSkip: () => void;
};

export function Controls({ running, onStartPause, onReset, onSkip }: Props) {
  return (
    <div className="pomodoro-controls">
      <button type="button" onClick={onReset}>
        RESET
      </button>
      <button
        type="button"
        className="pomodoro-controls__primary"
        onClick={onStartPause}
      >
        {running ? 'PAUSE' : 'START'}
      </button>
      <button type="button" onClick={onSkip}>
        SKIP
      </button>
    </div>
  );
}