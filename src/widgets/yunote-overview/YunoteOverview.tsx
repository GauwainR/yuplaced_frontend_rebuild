import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers';
import { TodayFocus } from '../today-focus';
import { routes } from '../../shared/config/routes';
import { heatmapData, activityData } from '../../pages/yunote/overview/mock';

export function YunoteOverview() {
  const { folders, tasks, settings } = useApp();
  const navigate = useNavigate();

  // Compute folder cards with task counts (matches legacy POPULAR_DATA shape)
  const folderCards = useMemo(
    () =>
      folders.map((f) => {
        const folderTasks = tasks.filter((t) => t.folderId === f.id);
        const activeCount = folderTasks.filter(
          (t) => t.status !== 'done',
        ).length;
        return { ...f, taskCount: folderTasks.length, activeCount };
      }),
    [folders, tasks],
  );

  const goFolders = () => navigate(routes.yunoteFolders);

  // Heatmap meta
  const maxLevel = 4;
  const totalEvents = heatmapData.reduce((s, c) => s + c.level, 0);
  const monthLabel = new Date().toLocaleDateString('ru', {
    month: 'long',
    year: 'numeric',
  });

  // Streak
  const streakText = settings.statistics.streak;
  const streakDays = parseInt(streakText, 10) || 0;

  return (
    <div className="overview-page">
      {/* ── STREAK ──────────────────────────────────────────── */}
      <div className="streak-banner">
        <div className="streak-banner__flame">🔥</div>
        <div className="streak-banner__body">
          <span className="streak-banner__count">{streakDays}</span>
          <span className="streak-banner__label">
            {streakDays === 1 ? 'day streak' : 'days streak'}
          </span>
        </div>
        <div className="streak-banner__dots">
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className={`streak-banner__dot ${
                i < streakDays ? 'is-active' : ''
              }`}
            />
          ))}
        </div>
      </div>

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
                <span
                  className="lang-dot"
                  style={{ background: f.color }}
                />
                <span className="repo-card-count">
                  {f.taskCount} tasks · {f.activeCount} active
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── MONTHLY HEATMAP ─────────────────────────────────── */}
      <div className="heatmap-wrap">
        <div className="heatmap-header">
          <span className="section-title">
            АКТИВНОСТЬ — {monthLabel.toUpperCase()}
          </span>
          <span className="heatmap-meta">
            30 дней · {totalEvents} событий
          </span>
        </div>

        <div className="heatmap-bars">
          {heatmapData.map((cell) => {
            const h =
              cell.level === 0
                ? 4
                : Math.round((cell.level / maxLevel) * 52) + 8;
            const op =
              cell.level === 0
                ? 0.12
                : 0.2 + (cell.level / maxLevel) * 0.8;
            return (
              <div key={cell.id} className="heatmap-bar-col">
                <div
                  className="heatmap-bar"
                  style={{
                    height: h,
                    background: `rgba(224, 64, 160, ${op})`,
                  }}
                  title={`${cell.date.toLocaleDateString('ru', {
                    day: 'numeric',
                    month: 'short',
                  })} · ${cell.level} events`}
                />
              </div>
            );
          })}
        </div>

        <div className="heatmap-axis">
          {[1, 8, 15, 22, 29].map((d) => (
            <span key={d} className="heatmap-axis__label">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* ── RECENT ACTIVITY ─────────────────────────────────── */}
      <div className="section-title-row" style={{ marginTop: 20 }}>
        <span className="section-title">RECENT ACTIVITY</span>
      </div>

      <div className="activity-grid">
        {activityData.length === 0 ? (
          <div className="overview-empty">— No recent activity —</div>
        ) : (
          activityData.map((a) => (
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
          ))
        )}
      </div>
    </div>
  );
}
