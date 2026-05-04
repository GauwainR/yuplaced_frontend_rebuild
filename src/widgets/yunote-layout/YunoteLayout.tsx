import { Outlet } from 'react-router-dom';
import { BackgroundCanvas } from '../../shared/ui/BackgroundCanvas';
import { YunoteHeader } from '../yunote-header';
import { YunoteTabs } from '../yunote-tabs';
import { useApp } from '../../app/providers';
import '../../styles/yunote-react.css';

export function YunoteLayout() {
  const { loading, error } = useApp();

  return (
    <div className="yn-page">
      <BackgroundCanvas />
      <div className="yn-shell">
        <YunoteHeader />
        <YunoteTabs />
        <main className="yn-content">
          {loading ? (
            <div className="yn-loading">
              <div className="yn-loading__spinner" />
              <span>Loading…</span>
            </div>
          ) : error ? (
            <div className="yn-error">
              <span className="yn-error__icon">⚠</span>
              <span>{error}</span>
              <button
                type="button"
                className="yn-error__retry"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
