/**
 * YUPLACED — Background Animation
 * Shared canvas: particle network + floating triangles + scan line + mouse interaction
 * Usage: include this script, ensure <canvas id="bg-canvas"> exists in the page.
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const PINK = '#e040a0';

  let W, H, dots, triangles, ripples = [];
  let mouse = { x: -9999, y: -9999 };
  let scanY = 0;

  /* ── Init ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = Array.from({ length: 90 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.1,
    }));
  }

  function initTriangles() {
    triangles = Array.from({ length: 5 }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      size: 120 + Math.random() * 200,
      vx:   (Math.random() - 0.5) * 0.08,
      vy:   (Math.random() - 0.5) * 0.08,
      rotation: Math.random() * Math.PI * 2,
      vr:   (Math.random() - 0.5) * 0.001,
      alpha: 0.04 + Math.random() * 0.04,
    }));
  }

  /* ── Draw helpers ── */
  function drawGrid() {
    ctx.strokeStyle = '#e040a008';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawScanLine() {
    const g = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    g.addColorStop(0,   'transparent');
    g.addColorStop(0.5, '#e040a008');
    g.addColorStop(1,   'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, scanY - 40, W, 80);
    scanY = (scanY + 0.6) % H;
  }

  function drawMouseGlow() {
    if (mouse.x < 0) return;
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
    g.addColorStop(0, '#e040a010');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRipples() {
    ripples = ripples.filter(r => r.alpha > 0.002);
    ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = PINK;
      ctx.globalAlpha  = r.alpha;
      ctx.lineWidth    = 1;
      ctx.stroke();
      r.radius += 2.5;
      r.alpha  *= 0.94;
    });
  }

  function drawTriangles() {
    triangles.forEach(t => {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rotation);
      ctx.strokeStyle = PINK;
      ctx.globalAlpha = t.alpha;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(0,          -t.size * 0.6);
      ctx.lineTo( t.size * 0.5,  t.size * 0.4);
      ctx.lineTo(-t.size * 0.5,  t.size * 0.4);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawDots() {
    const CONNECT   = 130;
    const M_CONNECT = 160;
    const MOUSE_R   = 200;

    // mouse → dot lines
    dots.forEach(d => {
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < M_CONNECT) {
        ctx.beginPath();
        ctx.strokeStyle = PINK;
        ctx.globalAlpha = (1 - dist / M_CONNECT) * 0.25;
        ctx.lineWidth   = 0.8;
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
    });

    // dot → dot connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECT) {
          ctx.beginPath();
          ctx.strokeStyle = PINK;
          ctx.globalAlpha = (1 - dist / CONNECT) * 0.07;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    dots.forEach(d => {
      const dist  = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      const boost = dist < MOUSE_R ? (1 - dist / MOUSE_R) * 1.8 : 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + boost * 1.2, 0, Math.PI * 2);
      ctx.fillStyle   = PINK;
      ctx.globalAlpha = Math.min(1, d.alpha + boost * 0.5);
      ctx.fill();
    });

    // cursor dot
    if (mouse.x > 0) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle   = PINK;
      ctx.globalAlpha = 0.2;
      ctx.fill();
    }
  }

  /* ── Update physics ── */
  function update() {
    const REPEL = 100;

    dots.forEach(d => {
      const dx   = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL && dist > 0) {
        const f = (REPEL - dist) / REPEL * 0.4;
        d.vx += (dx / dist) * f;
        d.vy += (dy / dist) * f;
      }
      d.vx *= 0.98; d.vy *= 0.98;
      const speed = Math.hypot(d.vx, d.vy);
      if (speed > 1.5) { d.vx = d.vx / speed * 1.5; d.vy = d.vy / speed * 1.5; }
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    triangles.forEach(t => {
      const dx   = mouse.x - t.x, dy = mouse.y - t.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 400 && dist > 0) t.vr += (dx / dist) * 0.00005;
      t.vr *= 0.99;
      t.x += t.vx; t.y += t.vy; t.rotation += t.vr;
      if (t.x < -t.size) t.x = W + t.size;
      if (t.x > W + t.size) t.x = -t.size;
      if (t.y < -t.size) t.y = H + t.size;
      if (t.y > H + t.size) t.y = -t.size;
    });
  }

  /* ── Main loop ── */
  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    drawGrid();
    drawScanLine();
    drawMouseGlow();
    drawRipples();
    drawTriangles();
    ctx.globalAlpha = 1;
    drawDots();
    ctx.globalAlpha = 1;
    update();
    requestAnimationFrame(frame);
  }

  /* ── Events ── */
  window.addEventListener('mousemove',  e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('click', e => {
    for (let i = 0; i < 3; i++) {
      ripples.push({ x: e.clientX, y: e.clientY, radius: i * 16, alpha: 0.5 - i * 0.12 });
    }
  });
  window.addEventListener('resize', () => { resize(); initDots(); initTriangles(); });

  /* ── Boot ── */
  resize();
  initDots();
  initTriangles();
  frame();
})();
