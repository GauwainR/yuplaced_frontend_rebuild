type Props = {
  sessions: boolean[];
};

export function SessionProgress({ sessions }: Props) {
  return (
    <div className="pomodoro-progress">
      <div className="pomodoro-progress__title">SESSION PROGRESS</div>
      <div className="pomodoro-progress__dots">
        {sessions.map((done, i) => (
          <span
            key={i}
            className={done ? 'pomodoro-progress__dot is-done' : 'pomodoro-progress__dot'}
          />
        ))}
      </div>
    </div>
  );
}