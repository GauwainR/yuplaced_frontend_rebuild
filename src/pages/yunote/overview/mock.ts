/** Static mock data for Overview — these would come from API endpoints. */

function seed(n: number): number {
  return (((Math.sin(n * 9301 + 49297) * 233280) % 1) + 1) % 1;
}

export type HeatmapCell = {
  id: number;
  date: Date;
  level: number;
  /** 0=Sun ... 6=Sat — row index in the grid */
  dow: number;
  /** Week column index (0-based from the oldest week) */
  week: number;
};

export type HeatmapWeek = {
  weekIndex: number;
  /** Month label to show above this column (or null if same month as previous) */
  monthLabel: string | null;
  cells: (HeatmapCell | null)[];
};

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function buildHeatmap(totalDays: number = 365): HeatmapWeek[] {
  const now = new Date();
  const cells: HeatmapCell[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const r = seed(i);
    const level = r < 0.35 ? 0 : r < 0.55 ? 1 : r < 0.72 ? 2 : r < 0.88 ? 3 : 4;
    cells.push({
      id: totalDays - 1 - i,
      date: d,
      level,
      dow: d.getDay(), // 0=Sun
      week: 0, // will be computed below
    });
  }

  // Assign week columns: start from the first cell's week-start (Sunday)
  const firstDate = cells[0].date;
  const firstSunday = new Date(firstDate);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());
  const firstSundayMs = firstSunday.getTime();

  cells.forEach((c) => {
    const sunday = new Date(c.date);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    c.week = Math.round(
      (sunday.getTime() - firstSundayMs) / (7 * 24 * 60 * 60 * 1000),
    );
  });

  const totalWeeks = (cells[cells.length - 1]?.week ?? 0) + 1;

  // Build grid: array of weeks, each containing 7 slots (Sun=0 ... Sat=6)
  const weeks: HeatmapWeek[] = [];
  let prevMonth = -1;

  for (let w = 0; w < totalWeeks; w++) {
    const weekCells: (HeatmapCell | null)[] = Array.from({ length: 7 }, () => null);
    const matching = cells.filter((c) => c.week === w);
    matching.forEach((c) => {
      weekCells[c.dow] = c;
    });

    // Find first non-null cell to determine month label
    const firstCell = weekCells.find((c) => c !== null);
    let monthLabel: string | null = null;
    if (firstCell) {
      const m = firstCell.date.getMonth();
      if (m !== prevMonth) {
        monthLabel = MONTH_SHORT[m];
        prevMonth = m;
      }
    }

    weeks.push({ weekIndex: w, monthLabel, cells: weekCells });
  }

  return weeks;
}

export const heatmapWeeks = buildHeatmap(365);
export const heatmapMaxLevel = 4;

// ── Recent activity (3 items) ──
export type ActivityItem = {
  id: number;
  text: string;
  strong: string;
  time: string;
  color: string;
};

export const activityData: ActivityItem[] = [
  { id: 1, text: 'Completed task', strong: 'Настроить CI/CD pipeline', time: '10 min ago', color: '#3fb950' },
  { id: 2, text: 'Generated insight for', strong: 'today report', time: '28 min ago', color: '#e040a0' },
  { id: 3, text: 'Logged time in', strong: 'frontend refactor', time: '1h ago', color: '#ff9800' },
];
