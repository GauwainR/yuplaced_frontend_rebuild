/** Static mock data for Overview — these would come from API endpoints. */

// ── Heatmap (deterministic seed for last 30 days, same algo as legacy) ──
function seed(n: number): number {
  return (((Math.sin(n * 9301 + 49297) * 233280) % 1) + 1) % 1;
}

export type HeatmapCell = {
  id: number;
  date: Date;
  level: number;
};

export const heatmapData: HeatmapCell[] = (() => {
  const cells: HeatmapCell[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const r = seed(i);
    const level = r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4;
    cells.push({ id: 29 - i, date: d, level });
  }
  return cells;
})();

// ── Recent activity ──
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
  { id: 4, text: 'Created folder', strong: 'PERSONAL', time: 'yesterday', color: '#58a6ff' },
];
