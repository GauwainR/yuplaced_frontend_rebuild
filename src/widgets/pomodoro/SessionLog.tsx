import type { PomodoroSession } from '../../entities/pomodoro/model/types';

type Props = {
  sessions: PomodoroSession[];
};

export function SessionLog({ sessions }: Props) {
  return (
    <section className="pomodoro-side-card">
      <h2>SESSION LOG</h2>

      <div className="pomodoro-session-list">
        {sessions.map((session) => (
          <div key={session.id} className="pomodoro-session">
            <span className={`pomodoro-session__dot pomodoro-session__dot--${session.type}`} />
            <span>{session.title}</span>
            <strong>{session.duration}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
