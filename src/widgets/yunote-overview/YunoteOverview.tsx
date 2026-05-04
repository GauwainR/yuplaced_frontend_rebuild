import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers';
import { TodayFocus } from '../today-focus';
import { routes } from '../../shared/config/routes';
import {
  heatmapWeeks,
  heatmapMaxLevel,
  activityData,
} from '../../pages/yunote/overview/mock';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function YunoteOverview() {
  const { folders, tasks, settings } = useApp();
  const navigate = useNavigate();

  // ── Streak toast ───────────────────────────────────────────
  const streakText = settings.statistics.streak;
  const streakDays = parseInt(streakText, 10) || 0;
  const [toastVisible, setToastVisible] = useState(false);
  const [toastLeaving, setToastLeaving] = useState(false);

  useEffect(() => {
    if (streakDays <= 0) return;
    const t1 = setTimeout(() => setToastVisible(true), 400);
    const t2 = setTimeout(() => setToastLeaving(true), 4400);
    const t3 = setTimeout(() => {
      setToastVisible(false);
      setToastLeaving(false);
    }, 4900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [streakDays]);

  // ── Folders ────────────────────────────────────────────────
  const folderCards = useMemo(
    () =>
      folders.map((f) => {
        const ft = tasks.filter((t) => t.folderId === f.id);
        const ac = ft.filter((t) => t.status !== 'done').length;
        return { ...f, taskCount: ft.length, activeCount: ac };
      }),
    [folders, tasks],
  );

  const goFolders = () => navigate(routes.yunoteFolders);

  // ── Heatmap totals ─────────────────────────────────────────
  const totalEvents = heatmapWeeks.reduce(
    (s, w) => s + w.cells.reduce((a, c) => a + (c?.level ?? 0), 0),
    0,
  );

  return (
    <div className="overview-page">
      {/* ── STREAK TOAST ────────────────────────────────────── */}
      {toastVisible && (
        <div className={`streak-toast ${toastLeaving ? 'is-leaving' : ''}`}>
          <div className="streak-toast__flame" aria-hidden>
            <span className="flame-icon">🔥</span>
          </div>
          <div className="streak-toast__body">
            <span className="streak-toast__count">{streakDays}</span>
            <span className="streak-toast__label">
              {streakDays === 1 ? 'day streak!' : 'days streak!'}
            </span>
          </div>
          <div className="streak-toast__dots">
            {Array.from({ length: 7 }, (_, i) => (
              <span
                key={i}
                className={`streak-toast__dot ${i < streakDays ? 'is-active' : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="streak-toast__close"
            onClick={() => {
              setToastLeaving(true);
              setTimeout(() => {
                setToastVisible(false);
                setToastLeaving(false);
              }, 400);
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── TODAY FOCUS ──────────────────────────────────────── */}
      <TodayFocus />

      {/* ── POPULAR FOLDERS ─────────────────────────────────── */}
      <div className="section-title-row">
        <span className="section-title">POPULAR FOLDERS</span>
        <span className="section-link" onClick={goFolders}>
          Все папки →
        </span>
      </div>

      <div className="overview-grid">
        {folderCards.length === 0 ? (
          <div className="overview-empty">
            — No folders yet. Create your first folder in the Folders tab —
          </div>
        ) : (
          folderCards.map((f) => (
            <div key={f.id} className="repo-card" onClick={goFolders}>
              <div className="repo-card__head">
                <span className="repo-card-name">{f.name}</span>
                {f.activeCount > 0 && (
                  <span className="repo-card-badge">ACTIVE</span>
                )}
              </div>
              {f.description && (
                <span className="repo-card-desc">{f.description}</span>
              )}
              <div className="repo-card-meta">
                <span className="lang-dot" style={{ background: f.color }} />
                <span className="repo-card-count">
                  {f.taskCount} tasks · {f.activeCount} active
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── ACTIVITY + HEATMAP row ──────────────────────────── */}
      <div className="activity-heatmap-row">
        {/* Left: GitHub-style heatmap */}
        <div className="heatmap-wrap">
          <div className="heatmap-header">
            <span className="section-title">АКТИВНОСТЬ</span>
            <span className="heatmap-meta">{totalEvents} events</span>
          </div>

          <div className="gh-heatmap">
            {/* Month labels row */}
            <div className="gh-heatmap__months">
              <div className="gh-heatmap__day-spacer" />
              {heatmapWeeks.map((w) => (
                <div key={w.weekIndex} className="gh-heatmap__month-cell">
                  {w.monthLabel && (
                    <span className="gh-heatmap__month-label">
                      {w.monthLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* 7 rows (Sun..Sat) × N week columns */}
            <div className="gh-heatmap__body">
              <div className="gh-heatmap__day-labels">
                {DAY_LABELS.map((label, i) => (
                  <div key={i} className="gh-heatmap__day-label">
                    {label}
                  </div>
                ))}
              </div>

              <div className="gh-heatmap__grid">
                {heatmapWeeks.map((w) => (
                  <div key={w.weekIndex} className="gh-heatmap__week">
                    {w.cells.map((cell, dow) => {
                      if (!cell) {
                        return (
                          <div
                            key={dow}
                            className="gh-heatmap__cell gh-heatmap__cell--empty"
                          />
                        );
                      }
                      const op =
                        cell.level === 0
                          ? 0
                          : 0.2 + (cell.level / heatmapMaxLevel) * 0.8;
                      return (
                        <div
                          key={dow}
                          className={`gh-heatmap__cell ${
                            cell.level > 0 ? 'has-data' : ''
                          }`}
                          style={
                            cell.level > 0
                              ? {
                                  backgroundColor: `rgba(224, 64, 160, ${op})`,
                                }
                              : undefined
                          }
                          title={`${cell.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })} — ${cell.level} events`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="gh-heatmap__legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((lvl) => {
                const op = lvl === 0 ? 0 : 0.2 + (lvl / 4) * 0.8;
                return (
                  <div
                    key={lvl}
                    className={`gh-heatmap__cell ${lvl > 0 ? 'has-data' : ''}`}
                    style={
                      lvl > 0
                        ? { backgroundColor: `rgba(224, 64, 160, ${op})` }
                        : undefined
                    }
                  />
                );
              })}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Right: Recent activity */}
        <div className="activity-wrap">
          <div className="section-title" style={{ marginBottom: 14 }}>
            RECENT ACTIVITY
          </div>

          <div className="activity-list">
            {activityData.map((a) => (
              <div key={a.id} className="activity-card">
                <div
                  className="activity-stripe"
                  style={{ background: a.color }}
                />
                <div className="activity-body">
                  <div className="activity-text">
                    {a.text} <strong>{a.strong}</strong>
                  </div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
