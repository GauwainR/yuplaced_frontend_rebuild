import { Card } from '../../shared/ui/card';
import { TodayFocus } from '../today-focus';
import { activity, folders, heatmap, todayFocusTasks } from '../../pages/yunote/overview/mock';

function heatmapClass(level: number) {
  return `yn-heat-cell l${level}`;
}

export function YunoteOverview() {
  return (
    <div className="yn-overview">
      <TodayFocus tasks={todayFocusTasks} />

      <section className="yn-section">
        <div className="yn-section-title-row">
          <h2 className="yn-section-title">FOLDERS</h2>
          <button className="yn-section-link" type="button">VIEW ALL</button>
        </div>
        <div className="yn-overview-grid">
          {folders.map((folder) => (
            <Card className="yn-folder-card" key={folder.id}>
              <div className="yn-folder-card-head">
                <span className="yn-folder-dot" style={{ background: folder.color }} />
                <span className="yn-folder-name">{folder.name}</span>
              </div>
              <p className="yn-folder-desc">{folder.description}</p>
              <div className="yn-folder-meta">
                <span>{folder.activeCount} active</span>
                <span>{folder.taskCount} total</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="yn-section yn-two-col">
        <Card className="yn-heatmap-wrap">
          <div className="yn-section-title-row compact">
            <h2 className="yn-section-title">ACTIVITY MAP</h2>
            <span className="yn-section-muted">30 DAYS</span>
          </div>
          <div className="yn-heatmap-grid">
            {heatmap.map((cell) => (
              <span className={heatmapClass(cell.level)} key={cell.id} />
            ))}
          </div>
        </Card>

        <Card className="yn-stats-card">
          <div className="yn-section-title-row compact">
            <h2 className="yn-section-title">TODAY</h2>
            <span className="yn-section-muted">LIVE</span>
          </div>
          <div className="yn-stat-row"><span>Time tracked</span><strong>3h 40m</strong></div>
          <div className="yn-stat-row"><span>Tasks done</span><strong>1 / 4</strong></div>
          <div className="yn-stat-row"><span>Focus score</span><strong>74%</strong></div>
        </Card>
      </section>

      <section className="yn-section">
        <div className="yn-section-title-row">
          <h2 className="yn-section-title">RECENT ACTIVITY</h2>
          <button className="yn-section-link" type="button">CLEAR</button>
        </div>
        <div className="yn-activity-grid">
          {activity.map((item) => (
            <Card className="yn-activity-card" key={item.id}>
              <span className="yn-activity-stripe" style={{ background: item.color }} />
              <div>
                <p className="yn-activity-text">{item.text} <strong>{item.strong}</strong></p>
                <span className="yn-activity-time">{item.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
