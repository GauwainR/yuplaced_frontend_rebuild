import { useApp } from '../../app/providers';
import { DailyReportSidebar } from './DailyReportSidebar';
import { DoneSection } from './DoneSection';
import { NextTasksSection } from './NextTasksSection';
import { NoteSection } from './NoteSection';
import { TimeSection } from './TimeSection';
import { ValueSection } from './ValueSection';

export function DailyReport() {
  const { dayReport: data } = useApp();

  return (
    <div className="daily-report-shell">
      <DailyReportSidebar recentDays={data.recentDays} stats={data.stats} />

      <main className="daily-report-grid">
        <DoneSection items={data.done} />
        <ValueSection value={data.value} />
        <TimeSection time={data.time} />
        <NoteSection note={data.note} />
        <NextTasksSection tasks={data.next} />
      </main>
    </div>
  );
}
