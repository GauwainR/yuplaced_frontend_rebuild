import { Link } from 'react-router-dom';
import { routes } from '../../shared/config/routes';
import { useApp } from '../../app/providers';

export function YunoteHeader() {
  const { settings } = useApp();
  const initial = settings.nickname.trim()[0]?.toUpperCase() ?? '?';

  const today = new Date();
  const dateLabel = today
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();

  return (
    <header className="yn-topbar">
      <div className="yn-topbar-brand">
        <Link to={routes.landing}>YUPLACED</Link>
        <span className="yn-sep">/</span>
        <span className="yn-current">YUNOTE</span>
      </div>

      <div className="yn-topbar-center">
        <span className="yn-day-label">{dateLabel}</span>
        <span className="yn-today-badge">TODAY</span>
      </div>

      <div className="yn-topbar-right">
        <Link to={routes.yunoteSettings} className="yn-user-icon" title={settings.nickname}>
          {initial}
        </Link>
      </div>
    </header>
  );
}
