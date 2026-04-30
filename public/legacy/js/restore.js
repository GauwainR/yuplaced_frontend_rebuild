/**
 * YUPLACED — Restore Password
 * Multi-step form logic: Email → Code → New Password → Success
 */

/* ── Step navigation ── */
function setStep(n) {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('step' + i);
    el.classList.remove('active', 'done');
    if (i < n) el.classList.add('done');
    if (i === n) el.classList.add('active');
  });
  [1, 2, 3, 4].forEach(i => {
    const screen = document.getElementById('screen-' + i);
    if (screen) screen.style.display = (i === n) ? 'block' : 'none';
  });
}

function goBack(n) { setStep(n); }

function goStep2() {
  const email = document.getElementById('email-input').value.trim() || 'you@example.com';
  document.getElementById('code-sub').innerHTML =
    `We sent a 4-digit code to <span style="color:var(--text);">${email}</span>`;
  setStep(2);
  document.getElementById('c1').focus();
  startResendTimer();
}

function goStep3() { setStep(3); }

function goSuccess() {
  setStep(4);
  document.getElementById('steps').style.display = 'none';
}

/* ── Code input: auto-jump to next field ── */
function codeNext(el, nextId) {
  if (el.value.length === 1 && nextId) {
    document.getElementById(nextId).focus();
  }
}

/* ── Resend timer ── */
let resendInterval;

function startResendTimer() {
  let t = 30;
  const btn   = document.getElementById('resend-btn');
  const label = document.getElementById('resend-timer');
  btn.disabled = true;
  clearInterval(resendInterval);
  resendInterval = setInterval(() => {
    t--;
    label.textContent = '0:' + String(t).padStart(2, '0');
    if (t <= 0) {
      clearInterval(resendInterval);
      btn.disabled      = false;
      label.textContent = '';
    }
  }, 1000);
}

function resend() {
  startResendTimer();
  ['c1', 'c2', 'c3', 'c4'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('c1').focus();
}

/* ── Expose to HTML onclick handlers ── */
Object.assign(window, { setStep, goBack, goStep2, goStep3, goSuccess, codeNext, resend });
