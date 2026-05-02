import { Link } from 'react-router-dom';
import { routes } from '../config/routes';
import { isLoggedIn } from '../api/authApi';
import { useApp } from '../../app/providers';

type NavVariant = 'landing' | 'auth';

type NavProps = {
  variant?: NavVariant;
};

export function Nav({ variant = 'landing' }: NavProps) {
  const loggedIn = isLoggedIn();

  if (variant === 'auth') {
    return (
      <nav>
        <Link to={routes.landing} className="nav-logo">YUPLACED</Link>
        <Link to={routes.landing} className="nav-back">← BACK TO HOME</Link>
      </nav>
    );
  }

  return (
    <nav>
      <Link to={routes.landing} className="nav-logo">YUPLACED</Link>
      <div className="nav-links" />

      {loggedIn ? (
        <div className="nav-auth">
          <NavAvatar />
        </div>
      ) : (
        <div className="nav-auth">
          <Link to={routes.login}>LOG IN</Link>
          <Link to={routes.signup} className="signup">SIGN UP</Link>
        </div>
      )}
    </nav>
  );
}

function NavAvatar() {
  const { settings } = useApp();
  const initial = settings.nickname.trim()[0]?.toUpperCase() ?? '?';

  return (
    <Link
      to={routes.yunoteSettings}
      className="nav-avatar"
      title={settings.nickname}
      aria-label="Settings"
    >
      {initial}
    </Link>
  );
}
