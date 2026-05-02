import { Card } from '../../shared/ui/card';
import { TodayFocus } from '../today-focus';
// Импортируем только типы из слоя entities!
import type { Folder } from '../../entities/folder/model/types';
import type { Task } from '../../entities/task/model/types';

// Описываем, какие данные нужны виджету для работы
interface YunoteOverviewProps {
  tasks: Task[];
  folders: Folder[];
  activity: any[]; // Замените any на ваш тип активности
  heatmap: { id: number; level: number }[];
  todayStats: {
    timeTracked: string;
    tasksDone: string;
    focusScore: string;
  };
}

function heatmapClass(level: number) {
  return `yn-heat-cell l${level}`;
}

export function YunoteOverview({ 
  tasks, 
  folders, 
  activity, 
  heatmap, 
  todayStats 
}: YunoteOverviewProps) {
  return (
    <div className="yn-overview">
      <TodayFocus tasks={tasks} />

      {/* Секция Folders */}
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

      {/* Секция Heatmap & Stats */}
      <section className="yn-section yn-two-col">
        <Card className="yn-heatmap-wrap">
          <div className="yn-section-title-row compact">
            <h2 className="yn-section-title">ACTIVITY MAP</h2>
            <span className="yn-section-muted">30 DAYS</span>
          </div>
          <div className="yn-heatmap-grid">
            {heatmap.map((cell) => (
              <span 
                className={heatmapClass(cell.level)} 
                key={cell.id} 
                title={`Level: ${cell.level}`} // Добавили title для UX
              />
            ))}
          </div>
        </Card>

        <Card className="yn-stats-card">
          <div className="yn-section-title-row compact">
            <h2 className="yn-section-title">TODAY</h2>
            <span className="yn-section-muted">LIVE</span>
          </div>
          <div className="yn-stat-row"><span>Time tracked</span><strong>{todayStats.timeTracked}</strong></div>
          <div className="yn-stat-row"><span>Tasks done</span><strong>{todayStats.tasksDone}</strong></div>
          <div className="yn-stat-row"><span>Focus score</span><strong>{todayStats.focusScore}</strong></div>
        </Card>
      </section>

      {/* Секция Activity */}
      <section className="yn-section">
        {/* ... код секции ... */}
      </section>
    </div>
  );
}