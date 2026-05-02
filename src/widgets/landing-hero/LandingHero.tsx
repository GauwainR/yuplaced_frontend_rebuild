import { Link } from 'react-router-dom';
import { Button, ButtonLink } from '../../shared/ui/button';
import { routes } from '../../shared/config/routes';
import { isLoggedIn } from '../../shared/api/authApi';

const apps = [
  { name: 'YUNOTE', status: 'AVAILABLE', active: true, to: routes.yunoteOverview },
  { name: 'YUCLOUD', status: 'COMING SOON', active: false, to: null },
  { name: 'YUNA', status: 'COMING SOON', active: false, to: null },
];

export function LandingHero() {
  const loggedIn = isLoggedIn();

  return (
    <section id="hero">
      <div className="geo">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
          <polygon points="100,800 400,200 700,800" stroke="#e040a0" strokeWidth="1" opacity="0.07" />
          <polygon points="800,900 1100,200 1400,900" stroke="#e040a0" strokeWidth="1" opacity="0.06" />
          <polygon points="-100,600 200,0 500,600" stroke="#e040a0" strokeWidth="0.5" opacity="0.04" />
        </svg>
      </div>

      <div className="hero-eyebrow">YOUR PERSONAL PRODUCTIVITY HUB</div>
      <div className="hero-title">YUPLACED</div>
      <div className="hero-sub">
        Track your day, manage tasks,
        <br />
        and reflect your progress.
      </div>

      <div className="hero-app-pills">
        {apps.map((app) => (
          <div className="app-pill-wrap" key={app.name}>
            {app.to ? (
              <Link to={app.to} className={app.active ? 'app-pill active' : 'app-pill'}>
                {app.name}
              </Link>
            ) : (
              <div className={app.active ? 'app-pill active' : 'app-pill'}>
                {app.name}
              </div>
            )}
            <span className={app.active ? 'app-pill-status active' : 'app-pill-status'}>
              {app.status}
            </span>
          </div>
        ))}
      </div>

      <div className="hero-divider" />

      <div className="hero-ctas">
        {!loggedIn && (
          <ButtonLink variant="primary" to={routes.signup}>
            Get started
          </ButtonLink>
        )}
        <Button
          variant="secondary"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }
        >
          Explore apps
        </Button>
      </div>

      <div className="scroll-hint-wrap">
        <div className="scroll-hint">
          <div className="scroll-hint-line" />
        </div>
      </div>
    </section>
  );
}
