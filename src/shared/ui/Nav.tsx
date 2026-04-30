import { Link } from 'react-router-dom';
import { routes } from '../config/routes';

type NavVariant = 'landing' | 'auth';

type NavProps = {
  variant?: NavVariant;
};

export function Nav({ variant = 'landing' }: NavProps) {
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
      <div className="nav-auth">
        <Link to={routes.login}>LOG IN</Link>
        <Link to={routes.signup} className="signup">SIGN UP</Link>
      </div>
    </nav>
  );
}
