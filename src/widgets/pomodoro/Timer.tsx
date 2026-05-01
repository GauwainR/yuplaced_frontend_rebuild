type Props = {
  secLeft: number;
  totalSec: number;
  phase: 'work' | 'break';
  running: boolean;
  accentColor: string;
};

const RADIUS = 90;
const CIRC = 2 * Math.PI * RADIUS;

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function Timer({ secLeft, totalSec, phase, running, accentColor }: Props) {
  const progress = totalSec === 0 ? 0 : 1 - secLeft / totalSec;
  const strokeColor = phase === 'work' ? accentColor : 'var(--pomodoro-green)';
  const phaseLabel = phase === 'work' ? 'FOCUS' : 'BREAK';

  return (
    <div className="pomodoro-ring-wrap">
      <svg className="pomodoro-ring-svg" viewBox="0 0 200 200" aria-hidden>
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="var(--pomodoro-border)"
          strokeWidth="4"
        />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="square"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
          transform="rotate(-90 100 100)"
          style={{
            transition: running ? 'stroke-dashoffset 1s linear' : 'none',
            filter: `drop-shadow(0 0 8px ${strokeColor})`,
          }}
        />
      </svg>

      <div className="pomodoro-ring-center">
        <span className="pomodoro-time">{fmt(secLeft)}</span>
        <span className="pomodoro-mode" style={{ color: strokeColor }}>
          {phaseLabel}
        </span>
      </div>
    </div>
  );
}