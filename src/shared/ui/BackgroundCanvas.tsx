import { useEffect, useRef } from 'react';

type Dot = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
};

type Triangle = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  alpha: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
};

const PINK = '#e040a0';

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let triangles: Triangle[] = [];
    let ripples: Ripple[] = [];
    let mouse = { x: -9999, y: -9999 };
    let scanY = 0;
    let animationFrame = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const initDots = () => {
      dots = Array.from({ length: 90 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.1,
      }));
    };

    const initTriangles = () => {
      triangles = Array.from({ length: 5 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 120 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.001,
        alpha: 0.04 + Math.random() * 0.04,
      }));
    };

    const drawGrid = () => {
      ctx.strokeStyle = '#e040a008';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawScanLine = () => {
      const gradient = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, '#e040a008');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 40, width, 80);
      scanY = (scanY + 0.6) % height;
    };

    const drawMouseGlow = () => {
      if (mouse.x < 0) return;
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
      gradient.addColorStop(0, '#e040a010');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawRipples = () => {
      ripples = ripples.filter((ripple) => ripple.alpha > 0.002);
      ripples.forEach((ripple) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = PINK;
        ctx.globalAlpha = ripple.alpha;
        ctx.lineWidth = 1;
        ctx.stroke();
        ripple.radius += 2.5;
        ripple.alpha *= 0.94;
      });
    };

    const drawTriangles = () => {
      triangles.forEach((triangle) => {
        ctx.save();
        ctx.translate(triangle.x, triangle.y);
        ctx.rotate(triangle.rotation);
        ctx.strokeStyle = PINK;
        ctx.globalAlpha = triangle.alpha;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -triangle.size * 0.6);
        ctx.lineTo(triangle.size * 0.5, triangle.size * 0.4);
        ctx.lineTo(-triangle.size * 0.5, triangle.size * 0.4);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawDots = () => {
      const connect = 130;
      const mouseConnect = 160;
      const mouseRadius = 200;

      dots.forEach((dot) => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouseConnect) {
          ctx.beginPath();
          ctx.strokeStyle = PINK;
          ctx.globalAlpha = (1 - distance / mouseConnect) * 0.25;
          ctx.lineWidth = 0.8;
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(dot.x, dot.y);
          ctx.stroke();
        }
      });

      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < connect) {
            ctx.beginPath();
            ctx.strokeStyle = PINK;
            ctx.globalAlpha = (1 - distance / connect) * 0.07;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      dots.forEach((dot) => {
        const distance = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
        const boost = distance < mouseRadius ? (1 - distance / mouseRadius) * 1.8 : 0;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r + boost * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = PINK;
        ctx.globalAlpha = Math.min(1, dot.alpha + boost * 0.5);
        ctx.fill();
      });

      if (mouse.x > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = PINK;
        ctx.globalAlpha = 0.2;
        ctx.fill();
      }
    };

    const update = () => {
      const repel = 100;

      dots.forEach((dot) => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < repel && distance > 0) {
          const force = ((repel - distance) / repel) * 0.4;
          dot.vx += (dx / distance) * force;
          dot.vy += (dy / distance) * force;
        }

        dot.vx *= 0.98;
        dot.vy *= 0.98;
        const speed = Math.hypot(dot.vx, dot.vy);
        if (speed > 1.5) {
          dot.vx = (dot.vx / speed) * 1.5;
          dot.vy = (dot.vy / speed) * 1.5;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      });

      triangles.forEach((triangle) => {
        const dx = mouse.x - triangle.x;
        const dy = mouse.y - triangle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 400 && distance > 0) triangle.vr += (dx / distance) * 0.00005;
        triangle.vr *= 0.99;
        triangle.x += triangle.vx;
        triangle.y += triangle.vy;
        triangle.rotation += triangle.vr;
        if (triangle.x < -triangle.size) triangle.x = width + triangle.size;
        if (triangle.x > width + triangle.size) triangle.x = -triangle.size;
        if (triangle.y < -triangle.size) triangle.y = height + triangle.size;
        if (triangle.y > height + triangle.size) triangle.y = -triangle.size;
      });
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
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
      animationFrame = requestAnimationFrame(frame);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    const handleClick = (event: MouseEvent) => {
      ripples.push({ x: event.clientX, y: event.clientY, radius: 0, alpha: 0.3 });
    };

    const handleResize = () => {
      resize();
      initDots();
      initTriangles();
    };

    resize();
    initDots();
    initTriangles();
    frame();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
