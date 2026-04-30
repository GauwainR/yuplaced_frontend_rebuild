import { Outlet } from 'react-router-dom';
import { BackgroundCanvas } from '../../shared/ui/BackgroundCanvas';
import { YunoteHeader } from '../yunote-header';
import { YunoteTabs } from '../yunote-tabs';
import '../../styles/yunote-react.css';

export function YunoteLayout() {
  return (
    <div className="yn-page">
      <BackgroundCanvas />
      <div className="yn-shell">
        <YunoteHeader />
        <YunoteTabs />
        <main className="yn-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
