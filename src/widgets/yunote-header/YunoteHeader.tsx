import { Link } from 'react-router-dom';
import { routes } from '../../shared/config/routes';

export function YunoteHeader() {
  return (
    <header className="yn-topbar">
      <div className="yn-topbar-brand">
        <Link to={routes.landing}>YUPLACED</Link>
        <span className="yn-sep">/</span>
        <span className="yn-current">YUNOTE</span>
      </div>

      <div className="yn-topbar-center">
        <button className="yn-day-nav-btn" type="button">◀</button>
        <span className="yn-day-label">APR 30, 2026</span>
        <button className="yn-day-nav-btn" type="button">▶</button>
        <span className="yn-today-badge">TODAY</span>
      </div>

      <div className="yn-topbar-right">
        <button className="yn-btn-new" type="button">+ NEW TASK</button>
        <div className="yn-user-icon">A</div>
      </div>
    </header>
  );
}
