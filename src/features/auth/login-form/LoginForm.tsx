import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, isLoggedIn } from '../../../shared/api/authApi';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button';
import { TextField } from '../../../shared/ui/text-field';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(routes.yunoteOverview, { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.login(email.trim(), password);
      navigate(routes.yunoteOverview, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-eyebrow">WELCOME BACK</div>
      <div className="auth-title">LOG IN</div>
      <div className="auth-sub">Access your personal productivity hub.</div>

      <div className={error ? 'error-message visible' : 'error-message'}>{error}</div>

      <TextField
        label="EMAIL"
        type="email"
        id="email-input"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <TextField
        label="PASSWORD"
        type="password"
        id="password-input"
        placeholder="••••••••"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="forgot">
        <Link to={routes.restorePassword}>FORGOT PASSWORD?</Link>
      </div>

      <Button className="btn-submit" variant="submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'LOGGING IN...' : 'LOG IN →'}
      </Button>

      <div className="auth-divider"><span>OR</span></div>

      <div className="auth-switch">
        Don&apos;t have an account? <Link to={routes.signup}>SIGN UP</Link>
      </div>
    </form>
  );
}
