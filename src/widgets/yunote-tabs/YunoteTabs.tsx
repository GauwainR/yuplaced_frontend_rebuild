import { NavLink } from 'react-router-dom';
import { routes } from '../../shared/config/routes';

const tabs = [
  { to: routes.yunoteOverview, label: 'OVERVIEW' },
  { to: routes.yunoteFolders, label: 'FOLDERS' },
  { to: routes.yunoteDailyReport, label: 'DAILY REPORT' },
  { to: routes.yunotePomodoro, label: 'POMODORO' },
  { to: routes.yunoteSettings, label: 'SETTINGS' },
];

export function YunoteTabs() {
  return (
    <nav className="yn-tab-bar" aria-label="YUNOTE sections">
      {tabs.map((tab) => (
        <NavLink
          className={({ isActive }) => (isActive ? 'yn-tab-item active' : 'yn-tab-item')}
          to={tab.to}
          key={tab.to}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
