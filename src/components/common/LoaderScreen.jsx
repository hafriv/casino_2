import React, { useEffect } from 'react';
import CasinoLogo from './CasinoLogo';
import BackgroundParticles from './BackgroundParticles';
import './LoaderScreen.css';

export default function LoaderScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 750);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="loader-screen">
      <BackgroundParticles count={24} />
      <div className="loader-content">
        <CasinoLogo />
        <div className="loader-title">Zeus Casino</div>
        <div className="loader-author">Сайт разработан студентом группы ИСиП-26 Морозовым Михаилом</div>
      </div>
    </div>
  );
} 