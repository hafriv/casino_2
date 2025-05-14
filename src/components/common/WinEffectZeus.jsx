import React, { useEffect, useRef } from 'react';
import zeusImg from '/assets/zeus.png'; // PNG/SVG Зевса (замените на свой)
import winTrack from '/assets/win-dubstep.mp3';
import './WinEffectZeus.css';

function WinEffectZeus({ onEnd }) {
  const audioRef = useRef(null);

  // Координаты точек для партиклов вдоль каждой молнии (в процентах от viewBox 1920x1080)
  const lightningParticles = [
    // Молния 1
    [
      { x: 960, y: 200, rot: -20 },
      { x: 1030, y: 400, rot: -10 },
      { x: 1100, y: 600, rot: 10 },
      { x: 1000, y: 600, rot: 0 },
      { x: 1050, y: 800, rot: 15 },
      { x: 1200, y: 1000, rot: 30 },
    ],
    // Молния 2
    [
      { x: 700, y: 400, rot: -30 },
      { x: 750, y: 600, rot: -10 },
      { x: 800, y: 800, rot: 10 },
      { x: 700, y: 900, rot: 0 },
      { x: 900, y: 1050, rot: 25 },
    ],
    // Молния 3
    [
      { x: 1200, y: 400, rot: -25 },
      { x: 1300, y: 600, rot: -5 },
      { x: 1400, y: 800, rot: 10 },
      { x: 1250, y: 900, rot: 0 },
      { x: 1500, y: 1050, rot: 20 },
    ],
  ];

  useEffect(() => {
    // Create audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio(winTrack);
      audioRef.current.volume = 1.0;
    }

    // Play audio
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    // Set up timer for effect end
    const timer = setTimeout(() => {
      if (onEnd) onEnd();
    }, 3000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onEnd]);

  return (
    <div className="zeus-effect-overlay">
      <img src={zeusImg} alt="Zeus" className="zeus-img" />
      {/* SVG молнии с dashoffset-анимацией */}
      <svg className="zeus-lightning-svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <polyline className="zeus-lightning zeus-lightning-1" points="960,200 1100,600 900,600 1200,1000" />
        <polyline className="zeus-lightning zeus-lightning-2" points="700,400 800,800 600,800 900,1050" />
        <polyline className="zeus-lightning zeus-lightning-3" points="1200,400 1400,800 1100,800 1500,1050" />
      </svg>
      <div className="zeus-particles">
        {lightningParticles.flatMap((arr, i) =>
          arr.map((p, j) => (
            <span
              key={`l${i}-p${j}`}
              className={`zeus-particle zeus-particle-bolt`}
              style={{
                left: `${(p.x / 1920) * 100}%`,
                top: `${(p.y / 1080) * 100}%`,
                transform: `rotate(${p.rot}deg)`,
                animationDelay: `${0.12 * j + 0.18 * i}s`,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default WinEffectZeus; 