import React, { useMemo, useRef, useState, useEffect } from 'react';
import './BackgroundParticles.css';

const COLORS = [
  '#ffe066', // мягкое золото
  '#b3e5fc', // светло-голубой
  '#e1bee7', // сиреневый
  '#fffbe6', // почти белый
  '#ffd6e0', // светло-розовый
  '#c8e6c9', // светло-зеленый
  '#f5f5f5', // серебристый
  '#d1c4e9', // светло-фиолетовый
];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const INTERACTIVE_RADIUS = 120;
const MAX_OFFSET = 28;
const RETURN_SPEED = 0.22;

export default function BackgroundParticles({ count = 38 }) {
  // Генерируем параметры партиклов один раз
  const particles = useMemo(() => (
    Array.from({ length: count }).map((_, i) => {
      const size = random(8, 32);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left = random(0, 100);
      const top = random(0, 100);
      const duration = random(6, 18);
      const delay = random(0, 8);
      const opacity = random(0.18, 0.45);
      const blur = random(0, 2.5);
      return { size, color, left, top, duration, delay, opacity, blur };
    })
  ), [count]);

  // Смещения для каждого партикла
  const [offsets, setOffsets] = useState(() => particles.map(() => ({ dx: 0, dy: 0 })));
  const flashRefs = useRef([]);
  const animFrame = useRef();
  const mousePos = useRef({ x: null, y: null });
  const lastMouse = useRef({ x: null, y: null, t: Date.now() });

  // Глобальный mousemove (только для десктопа)
  useEffect(() => {
    function handle(e) {
      if (window.innerWidth < 600 || 'ontouchstart' in window) return; // отключаем на мобильных
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Flash при быстром движении мыши
      const now = Date.now();
      if (lastMouse.current.x !== null) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        const dt = now - lastMouse.current.t;
        const speed = Math.sqrt(dx*dx + dy*dy) / (dt || 1);
        if (speed > 1.5) {
          // Вспышка у ближайших 5 частиц
          const rect = { width: window.innerWidth, height: window.innerHeight };
          const mx = e.clientX, my = e.clientY;
          const dists = particles.map((p, i) => {
            const px = (p.left / 100) * rect.width;
            const py = (p.top / 100) * rect.height;
            return { i, dist: Math.sqrt((px - mx) ** 2 + (py - my) ** 2) };
          });
          dists.sort((a, b) => a.dist - b.dist);
          for (let n = 0; n < 5; n++) {
            const idx = dists[n]?.i;
            if (flashRefs.current[idx]) {
              flashRefs.current[idx].classList.add('bg-particle-flash');
              setTimeout(() => {
                if (flashRefs.current[idx]) flashRefs.current[idx].classList.remove('bg-particle-flash');
              }, 400);
            }
          }
        }
      }
      lastMouse.current = { x: e.clientX, y: e.clientY, t: now };
    }
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [particles]);

  // Анимация смещений
  useEffect(() => {
    let running = true;
    function animate() {
      setOffsets(prev => prev.map((o, i) => {
        const p = particles[i];
        if (mousePos.current.x === null) {
          // Плавный возврат
          return {
            dx: o.dx * (1 - RETURN_SPEED),
            dy: o.dy * (1 - RETURN_SPEED),
          };
        }
        const rect = { width: window.innerWidth, height: window.innerHeight };
        const px = (p.left / 100) * rect.width;
        const py = (p.top / 100) * rect.height;
        const dx = px - mousePos.current.x;
        const dy = py - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INTERACTIVE_RADIUS) {
          // Flash
          if (flashRefs.current[i]) {
            flashRefs.current[i].classList.add('bg-particle-flash');
            setTimeout(() => {
              if (flashRefs.current[i]) flashRefs.current[i].classList.remove('bg-particle-flash');
            }, 400);
          }
          // Отталкивание
          const force = (INTERACTIVE_RADIUS - dist) / INTERACTIVE_RADIUS;
          const angle = Math.atan2(dy, dx);
          return {
            dx: Math.cos(angle) * MAX_OFFSET * force,
            dy: Math.sin(angle) * MAX_OFFSET * force,
          };
        } else {
          // Плавный возврат
          return {
            dx: o.dx * (1 - RETURN_SPEED),
            dy: o.dy * (1 - RETURN_SPEED),
          };
        }
      }));
      if (running) animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(animFrame.current); };
  }, [particles]);

  // Flash-эффект для живости (несколько частиц одновременно, чаще)
  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 2; // 2-4 вспышки
      for (let n = 0; n < count; n++) {
        const idx = Math.floor(Math.random() * particles.length);
        if (flashRefs.current[idx]) {
          flashRefs.current[idx].classList.add('bg-particle-flash');
          setTimeout(() => {
            if (flashRefs.current[idx]) flashRefs.current[idx].classList.remove('bg-particle-flash');
          }, 400);
        }
      }
    }, 700);
    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="bg-particles">
      {particles.map((p, i) => (
        <div
          key={i}
          className="bg-particle"
          ref={el => (flashRefs.current[i] = el)}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 80%)`,
            animation: `pulseGlow 2.2s infinite alternate, bgParticleMove ${p.duration}s linear infinite, bgParticleFade 3.2s ease-in-out infinite alternate`,
            animationDelay: `0s, ${p.delay}s, 0s`,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            transform: `translate(${offsets[i]?.dx || 0}px, ${offsets[i]?.dy || 0}px)`
          }}
        />
      ))}
    </div>
  );
} 