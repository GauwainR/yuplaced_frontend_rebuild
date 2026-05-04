import { useState } from 'react';
import { useApp } from '../../app/providers';
import { DailyReportSidebar } from './DailyReportSidebar';
import { DoneSection } from './DoneSection';
import { TimeSection } from './TimeSection';
import { NoteSection } from './NoteSection';
import { NextTasksSection } from './NextTasksSection';
import { ValueSection } from './ValueSection';

export function DailyReport() {
  const { dayReport } = useApp();

  const [timeOpen, setTimeOpen] = useState(true);
  const [noteOpen, setNoteOpen] = useState(true);
  const [nextOpen, setNextOpen] = useState(true);
  const [valueOpen, setValueOpen] = useState(true);

  return (
    <div className="daily-layout">
      <DailyReportSidebar
        recentDays={dayReport.recentDays}
        stats={dayReport.stats}
      />

      <div className="daily-main">
        <DoneSection items={dayReport.done} />

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
          <ValueSection
            values={dayReport.values}
            doneItems={dayReport.done}
            open={valueOpen}
            onToggle={() => setValueOpen((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}
