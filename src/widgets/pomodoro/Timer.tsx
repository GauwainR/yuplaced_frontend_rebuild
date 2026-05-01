import { useEffect, useState } from 'react';

export function Timer() {
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(s => s > 0 ? s - 1 : 0);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div>
      <h2>{min}:{sec.toString().padStart(2, '0')}</h2>
      <button onClick={() => setRunning(!running)}>
        {running ? 'STOP' : 'START'}
      </button>
    </div>
  );
}