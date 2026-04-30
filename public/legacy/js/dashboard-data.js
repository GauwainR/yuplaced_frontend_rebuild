/* ── Пустые данные — будут заполняться через API ── */
const FOLDERS_DATA = [];
const DAYS_DATA = [];
const ACTIVITY_DATA = [];
const POPULAR_DATA = [];
const TODAY_FOCUS_DATA = [];
const SUGGESTED_NEXT = [];

/* ── Heatmap (последние 30 дней) ── */
const HEATMAP_DATA = (() => {
  const seed = (n) => ((Math.sin(n * 9301 + 49297) * 233280) % 1 + 1) % 1;
  const cells = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const r = seed(i);
    cells.push({ date: d, level: r<0.3?0 : r<0.55?1 : r<0.75?2 : r<0.9?3 : 4 });
  }
  return cells;
})();

/* ── Tag → colour map ── */
const TAG_COLORS = {
  devops:"pink", review:"orange", docs:"blue", backend:"pink",
  algo:"blue", lang:"orange", book:"", feat:"pink",
  design:"blue", milestone:"orange", health:"",
};

/* ── Priority → badge class ── */
const PRI_COLORS = { high:"high", med:"med", low:"low" };

/* ── Helper: секунды → "Xч Yм" ── */
function fmtDuration(seconds) {
  if (!seconds) return "0м";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h && m) return `${h}ч ${m}м`;
  if (h) return `${h}ч`;
  return `${m}м`;
}

/* ── Tabs ── */
const TABS = [
  { id:"overview",  label:"OVERVIEW" },
  { id:"folders",   label:"FOLDERS" },
  { id:"daily",     label:"DAILY REPORT" },
  { id:"pomodoro",  label:"POMODORO" },
  { id:"settings",  label:"SETTINGS" },
];