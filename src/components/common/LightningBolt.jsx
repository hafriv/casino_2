import React from 'react';
import './LightningBolt.css';
import './LightningBoltParticles.css';

// Координаты точек вдоль path для партиклов (ручной зигзаг)
const leftPoints = [
  { x: 60, y: 10 },
  { x: 70, y: 60 },
  { x: 50, y: 100 },
  { x: 80, y: 160 },
  { x: 40, y: 210 },
  { x: 90, y: 270 },
  { x: 60, y: 390 },
];
const rightPoints = [
  { x: 60, y: 10 },
  { x: 50, y: 60 },
  { x: 80, y: 120 },
  { x: 40, y: 180 },
  { x: 90, y: 240 },
  { x: 60, y: 390 },
];
const centerPoints = [
  { x: 60, y: 10 },
  { x: 60, y: 60 },
  { x: 60, y: 120 },
  { x: 60, y: 180 },
  { x: 60, y: 240 },
  { x: 60, y: 320 },
  { x: 60, y: 390 },
];

function lighten(hex, amt = 40) {
  // hex: #rrggbb, amt: 0-255
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  let [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16));
  r = Math.min(255, r + amt);
  g = Math.min(255, g + amt);
  b = Math.min(255, b + amt);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getParticles(points, color, side) {
  // Для каждой точки рендерим 2-3 партикла с разными углами
  const angles = side === 'left' ? [-60, -30, -90] : [60, 30, 90];
  return points.flatMap((pt, i) =>
    angles.map((a, j) => {
      const rad = (a * Math.PI) / 180;
      const dx = Math.cos(rad) * 18;
      const dy = Math.sin(rad) * 12;
      return (
        <div
          key={`p-${i}-${j}`}
          className="bolt-particle"
          style={{
            left: pt.x - 7,
            top: pt.y - 3,
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
            '--bolt-color': color,
            animationDelay: `${(i * 0.13 + j * 0.09).toFixed(2)}s`,
          }}
        />
      );
    })
  );
}

export default function LightningBolt({ side = 'left', color = '#ffd700', className = '' }) {
  let path, points;
  if (side === 'left') {
    path = 'M60 10 L70 60 L50 100 L80 160 L40 210 L90 270 L60 390';
    points = leftPoints;
  } else if (side === 'right') {
    path = 'M60 10 L50 60 L80 120 L40 180 L90 240 L60 390';
    points = rightPoints;
  } else {
    path = 'M60 10 L60 60 L60 120 L60 180 L60 240 L60 320 L60 390';
    points = centerPoints;
  }
  const gradId = `zeus-bolt-${side}`;
  const filterId = `zeus-glow-${side}`;
  const altColor = lighten(color, 60);
  return (
    <div className={`lightning lightning-${side} ${className}`}
      style={{ pointerEvents: 'none' }}>
      <svg width="120" height="400" viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff"/>
            <stop offset="60%" stopColor={color}>
              <animate attributeName="stop-color" values={`${color};${altColor};${color}`} dur="2.2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ffe066"/>
          </linearGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#fffbe6" floodOpacity="0.7"/>
            <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor={color} floodOpacity="0.4"/>
          </filter>
        </defs>
        <path
          className="lightning-bolt"
          d={path}
          stroke={`url(#${gradId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          filter={`url(#${filterId})`}
        />
      </svg>
      {getParticles(points, color, side)}
    </div>
  );
} 