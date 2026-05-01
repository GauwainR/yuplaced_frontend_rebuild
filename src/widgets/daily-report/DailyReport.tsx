import { useApp } from '../../app/providers';
import { DailyReportSidebar } from './DailyReportSidebar';
import { DoneSection } from './DoneSection';
import { NextTasksSection } from './NextTasksSection';
import { NoteSection } from './NoteSection';
import { TimeSection } from './TimeSection';
import { ValueSection } from './ValueSection';

export function DailyReport() {
  const { dayReport } = useApp();

  return (
    <div className="daily-report-shell">
      <DailyReportSidebar
        recentDays={dayReport.recentDays}
        stats={dayReport.stats}
      />

      <main className="daily-report-grid">
        <DoneSection items={dayReport.done} />
        <ValueSection value={dayReport.value} />
        <TimeSection time={dayReport.time} />
        <NoteSection note={dayReport.note} />
        <NextTasksSection tasks={dayReport.next} />
      </main>
    </div>
  );
}