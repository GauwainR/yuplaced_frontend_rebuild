import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPasswordStrength } from '../../../entities/auth/model/passwordStrength';
import { authApi } from '../../../shared/api/authApi';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button';
import { PasswordStrength } from '../../../shared/ui/password-strength';
import { TextField } from '../../../shared/ui/text-field';

export function SignupForm() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!nickname.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.signup(nickname.trim(), email.trim(), password);
      navigate(routes.yunoteOverview, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-card auth-card--signup" onSubmit={handleSubmit}>
      <div className="auth-eyebrow">CREATE ACCOUNT</div>
      <div className="auth-title">SIGN UP</div>
      <div className="auth-sub">Start owning your day. Free for 14 days.</div>

      <div className={error ? 'error-message visible' : 'error-message'}>{error}</div>

      <TextField
        label="NICKNAME"
        type="text"
        id="nickname-input"
        placeholder="e.g. alex42"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
      />

      <TextField
        label="EMAIL"
        type="email"
        id="email-input"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <div className="field">
        <label className="field-label" htmlFor="pwd-input">PASSWORD</label>
        <input
          className="field-input"
          type="password"
          placeholder="Min. 8 characters"
          id="pwd-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength strength={strength} />
      </div>

      <div className="terms-row">
        <button
          className={termsAccepted ? 'terms-check checked' : 'terms-check'}
          type="button"
          aria-label="Accept terms"
          onClick={() => setTermsAccepted((current) => !current)}
        />
        <div className="terms-text">
          I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of YUPLACED.
        </div>
      </div>

      <Button className="btn-submit" variant="submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT →'}
      </Button>

      <div className="auth-divider"><span>OR</span></div>

      <div className="auth-switch">
        Already have an account? <Link to={routes.login}>LOG IN</Link>
      </div>
    </form>
  );
}
