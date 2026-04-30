/**
 * YUPLACED — YUNOTE App Logic
 * Data layer, rendering, timer, day navigation
 * Подключён к FastAPI бэкенду через js/api.js
 */

/* ── Guard: редирект если не залогинен ── */
if (!isLoggedIn()) window.location.href = 'index.html';

/* ── App state ── */
let data        = {};       // { "2025-04-28": { done, value, time, note, next } }
let currentKey  = todayKey();
let timerInterval = null;
let timerSeconds  = 0;
let timerRunning  = false;
let saveTimeout   = null;   // дебаунс для автосохранения

/* ── Helpers ── */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatKey(key) {
  return new Date(key + 'T12:00:00')
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase();
}

function emptyDay() {
  return { done: [], value: '', time: [], note: '', next: [] };
}

function fmtTime(s) {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  return h + ':' + m;
}

/* ── API: загрузить все дни ── */
async function loadAllDays() {
  try {
    const days = await Yunote.getDays();
    data = {};
    days.forEach(d => {
      data[d.date_key] = {
        value: d.value,
        note:  d.note,
        done:  d.done.map(t => ({ text: t.text, done: t.done })),
        next:  d.next.map(t => t.text),
        time:  d.time.map(t => ({ label: t.label, seconds: t.seconds })),
      };
    });
    // Убедимся что сегодня есть
    if (!data[currentKey]) data[currentKey] = emptyDay();
  } catch (e) {
    console.error('Failed to load days:', e);
    data[currentKey] = emptyDay();
  }
}

/* ── API: сохранить текущий день (с дебаунсом 800ms) ── */
function scheduleSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveCurrentDay(), 800);
}

async function saveCurrentDay() {
  const day = data[currentKey] || emptyDay();
  try {
    await Yunote.saveDay(currentKey, {
      value: day.value,
      note:  day.note,
      done:  day.done.map((t, i) => ({ text: t.text, done: t.done, order: i })),
      next:  day.next.map((t, i) => ({ text: t, order: i })),
      time:  day.time,
    });
  } catch (e) {
    console.error('Failed to save day:', e);
  }
}

/* ── Геттеры/сеттеры ── */
function getDay()  { return data[currentKey] || emptyDay(); }
function setDay(d) { data[currentKey] = d; scheduleSave(); }

/* ─────────────────────────── TIMER ─────────────────────────── */
function updateTimerDisplay() {
  document.getElementById('time-display').textContent = fmtTime(timerSeconds);
}

document.getElementById('timer-toggle').addEventListener('click', () => {
  timerRunning = !timerRunning;
  const btn = document.getElementById('timer-toggle');
  const dot = document.getElementById('timer-running-dot');
  if (timerRunning) {
    btn.textContent = 'PAUSE';
    btn.classList.add('running');
    dot.style.display = 'block';
    timerInterval = setInterval(() => { timerSeconds++; updateTimerDisplay(); }, 1000);
  } else {
    btn.textContent = 'START';
    btn.classList.remove('running');
    dot.style.display = 'none';
    clearInterval(timerInterval);
  }
});

document.getElementById('timer-log').addEventListener('click', () => {
  if (timerSeconds === 0) return;
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('timer-toggle').textContent = 'START';
  document.getElementById('timer-toggle').classList.remove('running');
  document.getElementById('timer-running-dot').style.display = 'none';
  const label = prompt('Label this session:', 'Deep work') || 'Session';
  const day = getDay();
  day.time.push({ label, seconds: timerSeconds });
  setDay(day);
  timerSeconds = 0;
  updateTimerDisplay();
  renderTimeEntries();
});

document.getElementById('timer-reset').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning  = false;
  timerSeconds  = 0;
  document.getElementById('timer-toggle').textContent = 'START';
  document.getElementById('timer-toggle').classList.remove('running');
  document.getElementById('timer-running-dot').style.display = 'none';
  updateTimerDisplay();
});

/* ─────────────────────── MANUAL TIME ADD ───────────────────── */
function parseTimeStr(str) {
  let s = 0;
  const h = str.match(/(\d+)\s*h/i); if (h) s += parseInt(h[1]) * 3600;
  const m = str.match(/(\d+)\s*m/i); if (m) s += parseInt(m[1]) * 60;
  return s;
}

document.getElementById('add-time-submit').addEventListener('click', addManualTime);
document.getElementById('add-time-val').addEventListener('keydown', e => { if (e.key === 'Enter') addManualTime(); });

function addManualTime() {
  const label   = document.getElementById('add-time-label').value.trim() || 'Manual entry';
  const seconds = parseTimeStr(document.getElementById('add-time-val').value.trim());
  if (!seconds) return;
  const day = getDay();
  day.time.push({ label, seconds });
  setDay(day);
  document.getElementById('add-time-label').value = '';
  document.getElementById('add-time-val').value   = '';
  renderTimeEntries();
}

/* ─────────────────────────── RENDER ────────────────────────── */
function renderAll() {
  const day = getDay();
  renderDone(day);
  renderValue(day);
  renderTimeEntries(day);
  renderNote(day);
  renderNext(day);
  renderDayLabel();
  renderSidebar();
  renderStats();
}

function renderDone(day) {
  day = day || getDay();
  const list  = document.getElementById('done-list');
  const empty = document.getElementById('done-empty');
  list.innerHTML = '';
  day.done.forEach((task, i) => {
    const row = document.createElement('div');
    row.className = 'task-item';
    row.innerHTML = `
      <div class="task-check ${task.done ? 'checked' : ''}" data-i="${i}"></div>
      <div class="task-text ${task.done ? 'done-text' : ''}" contenteditable="true">${task.text}</div>
      <button class="task-del">×</button>
    `;
    row.querySelector('.task-check').addEventListener('click', () => {
      const d = getDay(); d.done[i].done = !d.done[i].done; setDay(d); renderDone();
    });
    row.querySelector('.task-text').addEventListener('blur', e => {
      const d = getDay(); d.done[i].text = e.target.textContent.trim(); setDay(d);
    });
    row.querySelector('.task-del').addEventListener('click', () => {
      const d = getDay(); d.done.splice(i, 1); setDay(d); renderDone(); renderStats();
    });
    list.appendChild(row);
  });
  empty.style.display = day.done.length ? 'none' : 'block';
}

function renderValue(day) {
  day = day || getDay();
  document.getElementById('value-text').value = day.value || '';
}

function renderTimeEntries(day) {
  day = day || getDay();
  const list  = document.getElementById('time-entries-list');
  const empty = document.getElementById('time-empty');
  list.innerHTML = '';
  let total = 0;
  day.time.forEach((e, i) => {
    total += e.seconds;
    const row = document.createElement('div');
    row.className = 'time-entry';
    row.title     = 'Click to delete';
    row.innerHTML = `<span class="time-entry-label">${e.label}</span><span class="time-entry-val">${fmtTime(e.seconds)}</span>`;
    row.addEventListener('click', () => {
      if (confirm('Remove this entry?')) {
        const d = getDay(); d.time.splice(i, 1); setDay(d); renderTimeEntries(); renderStats();
      }
    });
    list.appendChild(row);
  });
  if (day.time.length) {
    const tot = document.createElement('div');
    tot.className = 'time-entry';
    tot.style.cssText = 'border-top:1px solid #333;margin-top:4px;';
    tot.innerHTML = `<span class="time-entry-label" style="color:var(--orange)">TOTAL</span><span class="time-entry-val" style="font-size:13px">${fmtTime(total)}</span>`;
    list.appendChild(tot);
  }
  empty.style.display = day.time.length ? 'none' : 'block';
}

function renderNote(day) {
  day = day || getDay();
  document.getElementById('note-text').value = day.note || '';
}

function renderNext(day) {
  day = day || getDay();
  const list  = document.getElementById('next-list');
  const empty = document.getElementById('next-empty');
  list.innerHTML = '';
  day.next.forEach((task, i) => {
    const row = document.createElement('div');
    row.className = 'task-item';
    row.innerHTML = `
      <div style="color:var(--purple);font-size:10px;margin-top:2px;">→</div>
      <div class="task-text" contenteditable="true">${task}</div>
      <button class="task-del">×</button>
    `;
    row.querySelector('.task-text').addEventListener('blur', e => {
      const d = getDay(); d.next[i] = e.target.textContent.trim(); setDay(d);
    });
    row.querySelector('.task-del').addEventListener('click', () => {
      const d = getDay(); d.next.splice(i, 1); setDay(d); renderNext();
    });
    list.appendChild(row);
  });
  empty.style.display = day.next.length ? 'none' : 'block';
}

function renderDayLabel() {
  const isToday = currentKey === todayKey();
  document.getElementById('day-label').textContent = formatKey(currentKey);
  document.getElementById('today-badge-el').style.display = isToday ? 'inline' : 'none';
}

function renderSidebar() {
  const list = document.getElementById('day-list');
  list.innerHTML = '';
  Object.keys(data).sort().reverse().slice(0, 10).forEach(key => {
    const taskCount = (data[key].done || []).length;
    const item = document.createElement('div');
    item.className = 'day-item' + (key === currentKey ? ' active' : '');
    item.innerHTML = `<span class="day-name">${formatKey(key)}</span><span class="day-count">${taskCount || ''}</span>`;
    item.addEventListener('click', () => { currentKey = key; renderAll(); });
    list.appendChild(item);
  });
}

function renderStats() {
  let totalTime = 0, totalTasks = 0;
  Object.values(data).forEach(d => {
    totalTasks += (d.done || []).filter(t => t.done).length;
    (d.time || []).forEach(e => totalTime += e.seconds);
  });
  document.getElementById('stat-time').textContent  = fmtTime(totalTime);
  document.getElementById('stat-tasks').textContent = totalTasks;
  document.getElementById('stat-days').textContent  = Object.keys(data).length;
}

/* ─────────────────────── ADD DONE ─────────────────────── */
document.getElementById('add-done-btn').addEventListener('click', () => {
  const row = document.getElementById('add-done-row');
  row.style.display = row.style.display === 'none' ? 'flex' : 'none';
  if (row.style.display === 'flex') document.getElementById('add-done-input').focus();
});
document.getElementById('add-done-submit').addEventListener('click', addDoneTask);
document.getElementById('add-done-input').addEventListener('keydown', e => { if (e.key === 'Enter') addDoneTask(); });

function addDoneTask() {
  const val = document.getElementById('add-done-input').value.trim();
  if (!val) return;
  const d = getDay(); d.done.push({ text: val, done: false }); setDay(d);
  document.getElementById('add-done-input').value = '';
  document.getElementById('add-done-row').style.display = 'none';
  renderDone(); renderStats();
}

/* ─────────────────────── ADD NEXT ─────────────────────── */
document.getElementById('add-next-btn').addEventListener('click', () => {
  const row = document.getElementById('add-next-row');
  row.style.display = row.style.display === 'none' ? 'flex' : 'none';
  if (row.style.display === 'flex') document.getElementById('add-next-input').focus();
});
document.getElementById('add-next-submit').addEventListener('click', addNextTask);
document.getElementById('add-next-input').addEventListener('keydown', e => { if (e.key === 'Enter') addNextTask(); });

function addNextTask() {
  const val = document.getElementById('add-next-input').value.trim();
  if (!val) return;
  const d = getDay(); d.next.push(val); setDay(d);
  document.getElementById('add-next-input').value = '';
  document.getElementById('add-next-row').style.display = 'none';
  renderNext();
}

/* ─────────────── AUTOSAVE VALUE + NOTE ────────────────── */
document.getElementById('value-text').addEventListener('input', e => {
  const d = getDay(); d.value = e.target.value; setDay(d);
});
document.getElementById('note-text').addEventListener('input', e => {
  const d = getDay(); d.note = e.target.value; setDay(d);
});

/* ─────────────────────── DAY NAV ──────────────────────── */
document.getElementById('btn-prev').addEventListener('click', () => {
  const keys = Object.keys(data).sort();
  const idx  = keys.indexOf(currentKey);
  if (idx > 0) { currentKey = keys[idx - 1]; renderAll(); }
});
document.getElementById('btn-next').addEventListener('click', () => {
  const keys = Object.keys(data).sort();
  const idx  = keys.indexOf(currentKey);
  if (idx < keys.length - 1) { currentKey = keys[idx + 1]; renderAll(); }
});
document.getElementById('btn-new-day').addEventListener('click', async () => {
  const key = todayKey();
  if (!data[key]) {
    data[key] = emptyDay();
    await saveCurrentDay();
  }
  currentKey = key;
  renderAll();
});

/* ── Boot: загрузить данные с сервера, затем отрисовать ── */
(async () => {
  await loadAllDays();
  renderAll();
})();
