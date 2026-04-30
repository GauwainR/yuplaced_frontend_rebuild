import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button';
import { TextField } from '../../../shared/ui/text-field';

type RestoreStep = 1 | 2 | 3 | 4;

function getStepClass(step: RestoreStep, currentStep: RestoreStep): string {
  if (currentStep === 4) return 'step done';
  if (step < currentStep) return 'step done';
  if (step === currentStep) return 'step active';
  return 'step';
}

export function RestorePasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RestoreStep>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(30);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== 2) return;

    setTimer(30);
    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [step]);

  function goStep2() {
    setStep(2);
    window.setTimeout(() => codeRefs.current[0]?.focus(), 0);
  }

  function handleCodeChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value.slice(-1);
    setCode((current) => current.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));

    if (nextValue && index < 3) {
      codeRefs.current[index + 1]?.focus();
    }
  }

  function resend() {
    setCode(['', '', '', '']);
    setTimer(30);
    window.setTimeout(() => codeRefs.current[0]?.focus(), 0);
  }

  function finishRestore() {
    if (!newPassword || !confirmPassword) return;
    setStep(4);
  }

  return (
    <div className="auth-card" id="auth-card">
      {step !== 4 && (
        <div className="steps" id="steps">
          {[1, 2, 3].map((item) => (
            <div className={getStepClass(item as RestoreStep, step)} id={`step${item}`} key={item}>
              <div className="step-dot">0{item}</div>
              <div className="step-label">{item === 1 ? 'EMAIL' : item === 2 ? 'CODE' : 'NEW PASSWORD'}</div>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div id="screen-1">
          <div className="auth-eyebrow">ACCOUNT RECOVERY</div>
          <div className="auth-title">RESTORE PASSWORD</div>
          <div className="auth-sub">Enter your email and we&apos;ll send you a verification code.</div>
          <TextField
            label="EMAIL"
            type="email"
            placeholder="you@example.com"
            id="email-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button className="btn-submit" variant="submit" onClick={goStep2}>SEND CODE →</Button>
          <div className="auth-switch">Remembered it? <Link to={routes.login}>LOG IN</Link></div>
        </div>
      )}

      {step === 2 && (
        <div id="screen-2">
          <div className="auth-eyebrow">CHECK YOUR EMAIL</div>
          <div className="auth-title">ENTER CODE</div>
          <div className="auth-sub" id="code-sub">
            We sent a 4-digit code to <span style={{ color: 'var(--text)' }}>{email.trim() || 'you@example.com'}</span>
          </div>
          <div className="code-row">
            {code.map((value, index) => (
              <input
                className="code-input"
                maxLength={1}
                id={`c${index + 1}`}
                key={index}
                ref={(element) => { codeRefs.current[index] = element; }}
                value={value}
                onChange={(event) => handleCodeChange(index, event)}
              />
            ))}
          </div>
          <div className="resend-row">
            <button className="resend-btn" id="resend-btn" onClick={resend} disabled={timer > 0} type="button">
              RESEND CODE
            </button>
            <span className="resend-timer" id="resend-timer">{timer > 0 ? `0:${String(timer).padStart(2, '0')}` : ''}</span>
          </div>
          <Button className="btn-submit" variant="submit" onClick={() => setStep(3)}>VERIFY →</Button>
          <div className="auth-switch"><button type="button" onClick={() => setStep(1)}>← CHANGE EMAIL</button></div>
        </div>
      )}

      {step === 3 && (
        <div id="screen-3">
          <div className="auth-eyebrow">ALMOST DONE</div>
          <div className="auth-title">NEW PASSWORD</div>
          <div className="auth-sub">Choose a strong password for your account.</div>
          <TextField
            label="NEW PASSWORD"
            type="password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <TextField
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button className="btn-submit" variant="submit" onClick={finishRestore}>SAVE PASSWORD →</Button>
        </div>
      )}

      {step === 4 && (
        <div id="screen-4" style={{ textAlign: 'center' }}>
          <div className="success-icon">✓</div>
          <div className="auth-eyebrow" style={{ textAlign: 'center' }}>ALL DONE</div>
          <div className="auth-title" style={{ textAlign: 'center', marginBottom: 12 }}>PASSWORD UPDATED</div>
          <div className="auth-sub" style={{ textAlign: 'center', marginBottom: 32 }}>
            Your password has been changed. You can now log in.
          </div>
          <Button className="btn-submit" variant="submit" onClick={() => navigate(routes.login)}>GO TO LOG IN →</Button>
        </div>
      )}
    </div>
  );
}
