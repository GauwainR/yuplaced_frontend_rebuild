import { useState } from 'react';
import { useApp } from '../../app/providers';
import { DailyReportSidebar } from './DailyReportSidebar';
import { DoneSection } from './DoneSection';
import { ValueSection } from './ValueSection';
import { TimeSection } from './TimeSection';
import { NoteSection } from './NoteSection';
import { NextTasksSection } from './NextTasksSection';

export function DailyReport() {
  const { dayReport } = useApp();

  // Collapsible state — initial values match legacy DailyReportTab:
  // TIME and NOTE start collapsed, NEXT starts open.
  const [timeOpen, setTimeOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [nextOpen, setNextOpen] = useState(true);

  return (
    <div className="daily-layout">
      <DailyReportSidebar
        recentDays={dayReport.recentDays}
        stats={dayReport.stats}
      />

      <div className="daily-main">
        <DoneSection items={dayReport.done} />
        <ValueSection value={dayReport.value} doneItems={dayReport.done} />

        <div className="collapsible-row">
          <TimeSection
            time={dayReport.time}
            open={timeOpen}
            onToggle={() => setTimeOpen((v) => !v)}
          />
          <NoteSection
            note={dayReport.note}
            open={noteOpen}
            onToggle={() => setNoteOpen((v) => !v)}
          />
          <NextTasksSection
            tasks={dayReport.next}
            open={nextOpen}
            onToggle={() => setNextOpen((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}
