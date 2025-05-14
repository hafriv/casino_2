import React from 'react';
import logo from '/assets/logo.png';
import './CasinoLogo.css';

function CasinoLogo() {
  return (
    <div className="casino-logo-wrapper">
      <img src={logo} alt="Casino Logo" className="casino-logo-img" />
      <svg className="casino-logo-svg" viewBox="0 0 200 100">
        <ellipse
          cx="100" cy="50" rx="92" ry="42"
          className="neon-outline-soft"
        />
      </svg>
    </div>
  );
}

export default CasinoLogo; 