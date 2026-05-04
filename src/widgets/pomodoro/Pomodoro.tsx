import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../app/providers';
import { Controls } from './Controls';
import { SessionLog } from './SessionLog';
import { SessionProgress } from './SessionProgress';
import { SettingsPanel } from './SettingsPanel';
import { Timer } from './Timer';
import { TaskPicker } from './TaskPicker';
import { TodayStats } from './TodayStats';
import type { PomodoroSession } from '../../entities/pomodoro/model/types';
import type { Task } from '../../entities/task/model/types';

type Phase = 'work' | 'break';

export function Pomodoro() {
  const { pomodoro, tasks, folders, settings: userSettings, addTimeToTask } = useApp();

  // ── Settings ───────────────────────────────────────────────
  const [workMin, setWorkMin] = useState(pomodoro.settings.workDuration);
  const [breakMin, setBreakMin] = useState(pomodoro.settings.breakDuration);
  const [dailyGoal, setDailyGoal] = useState(pomodoro.settings.dailyGoal);

  // ── Task attachment ────────────────────────────────────────
  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === 'in_progress'),
    [tasks],
  );
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Auto-select first in-progress task if nothing selected
  useEffect(() => {
    if (selectedTaskId !== null) {
      // Verify still valid
      if (!inProgressTasks.find((t) => t.id === selectedTaskId)) {
        setSelectedTaskId(inProgressTasks[0]?.id ?? null);
      }
      return;
    }
    if (inProgressTasks.length > 0) {
      setSelectedTaskId(inProgressTasks[0].id);
    }
  }, [inProgressTasks, selectedTaskId]);

  const selectedTask: Task | null = useMemo(
    () => inProgressTasks.find((t) => t.id === selectedTaskId) ?? null,
    [inProgressTasks, selectedTaskId],
  );

  const selectedFolder = useMemo(
    () =>
      selectedTask
        ? folders.find((f) => f.id === selectedTask.folderId) ?? null
        : null,
    [folders, selectedTask],
  );

  // ── Runtime state ──────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('work');
  const [secLeft, setSecLeft] = useState(workMin * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<boolean[]>(
    Array.from({ length: dailyGoal }, () => false),
  );
  const [log, setLog] = useState<PomodoroSession[]>(pomodoro.sessions);

  const intervalRef = useRef<number | null>(null);
  const selectedTaskRef = useRef<number | null>(selectedTaskId);
  selectedTaskRef.current = selectedTaskId;
  const totalSec = phase === 'work' ? workMin * 60 : breakMin * 60;

  // Resize sessions array if dailyGoal changes
  useEffect(() => {
    setSessions((prev) => {
      if (prev.length === dailyGoal) return prev;
      if (prev.length < dailyGoal) {
        return [
          ...prev,
          ...Array.from({ length: dailyGoal - prev.length }, () => false),
        ];
      }
      return prev.slice(0, dailyGoal);
    });
  }, [dailyGoal]);

  // Adjust secLeft when work/break duration changes while idle
  useEffect(() => {
    if (running) return;
    setSecLeft(phase === 'work' ? workMin * 60 : breakMin * 60);
  }, [workMin, breakMin, phase, running]);

  // Timer ticking
  useEffect(() => {
    if (!running) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecLeft((s) => {
        if (s > 1) return s - 1;

        window.clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setRunning(false);

        if (phase === 'work') {
          setSessions((prev) => {
            const i = prev.findIndex((v) => !v);
            if (i < 0) return prev;
            const next = [...prev];
            next[i] = true;
            return next;
          });

          // Build log entry with task name
          const taskLabel = selectedTask
            ? `Deep work — ${selectedTask.title}`
            : 'Deep work — session done';

          const newEntry: PomodoroSession = {
            id: Date.now(),
            title: taskLabel,
            type: 'focus',
            duration: `${String(workMin).padStart(2, '0')}:00`,
          };
          setLog((prev) => [newEntry, ...prev].slice(0, 12));

          // Track time on the attached task
          if (selectedTaskRef.current !== null) {
            addTimeToTask(selectedTaskRef.current, workMin);
          }

          setPhase('break');
          return breakMin * 60;
        } else {
          setPhase('work');
          return workMin * 60;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // selectedTask is intentionally NOT in deps — we snapshot it at session start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, workMin, breakMin]);

  // ── Handlers ──────────────────────────────────────────────
  const handleStartPause = () => setRunning((v) => !v);

  const handleReset = () => {
    setRunning(false);
    setPhase('work');
    setSecLeft(workMin * 60);
  };

  const handleSkip = () => {
    setRunning(false);
    if (phase === 'work') {
      setPhase('break');
      setSecLeft(breakMin * 60);
    } else {
      setPhase('work');
      setSecLeft(workMin * 60);
    }
  };

  // ── Derived stats ─────────────────────────────────────────
  const sessionsDone = sessions.filter(Boolean).length;
  const focusMinutes = sessionsDone * workMin;
  const liveStats = {
    sessions: `${sessionsDone}/${sessions.length}`,
    focusTime: `${focusMinutes}m`,
    streak: pomodoro.stats.streak,
  };

  return (
    <div className="pomodoro-shell">
      <main className="pomodoro-main">
        <Timer
          secLeft={secLeft}
          totalSec={totalSec}
          phase={phase}
          running={running}
          accentColor={userSettings.accentColor}
          taskTitle={selectedTask?.title ?? null}
          folderColor={selectedFolder?.color ?? null}
        />
        <Controls
          running={running}
          onStartPause={handleStartPause}
          onReset={handleReset}
          onSkip={handleSkip}
        />
        <SessionProgress sessions={sessions} />
      </main>

      <aside className="pomodoro-sidebar">
        <section className="pomodoro-side-card pomodoro-side-card--picker">
          <h2>CURRENT TASK</h2>
          <TaskPicker
            tasks={inProgressTasks}
            folders={folders}
            selectedTaskId={selectedTaskId}
            onSelect={setSelectedTaskId}
            disabled={running}
          />
        </section>
        <SettingsPanel
          workMin={workMin}
          breakMin={breakMin}
          dailyGoal={dailyGoal}
          onWorkChange={setWorkMin}
          onBreakChange={setBreakMin}
          onDailyGoalChange={setDailyGoal}
        />
        <SessionLog sessions={log} />
        <TodayStats stats={liveStats} />
      </aside>
    </div>
  );
}
