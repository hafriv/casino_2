import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoins, 
  faHome, 
  faUser, 
  faDice, 
  faTrophy,
  faSignOutAlt,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import CasinoLogo from './CasinoLogo';
import { useEffect, useRef, useState } from 'react';

function AnimatedBalance({ value }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [diff, setDiff] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const raf = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    if (displayValue === value) return;
    let start = null;
    const duration = 700;
    const from = displayValue;
    const to = value;
    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const current = Math.round(from + (to - from) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    }
    // Показываем списание монет, если баланс уменьшился
    if (value < displayValue) {
      setDiff(displayValue - value);
      setShowDiff(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowDiff(false), 1200);
    }
    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <span style={{position:'relative',display:'inline-block'}}>
      {displayValue.toLocaleString()}
      {showDiff && diff > 0 && (
        <span style={{
          position: 'absolute',
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#ff3b3b',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginLeft: 8,
          opacity: 0.85,
          animation: 'fadeUp 1.2s cubic-bezier(.4,1.6,.6,1)'
        }}>
          -{diff.toLocaleString()}
        </span>
      )}
    </span>
  );
}

// Добавим keyframes для fadeUp в глобальные стили (index.css или App.css):
// @keyframes fadeUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-18px); } }

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <CasinoLogo />
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon={faHome} />
            <span>Главная</span>
          </Link>
          {user ? (
            <>
              <Link to="/slot-machine" className="nav-link">
                <FontAwesomeIcon icon={faTrophy} />
                <span>Слоты</span>
              </Link>
              <Link to="/roulette" className="nav-link">
                <FontAwesomeIcon icon={faTrophy} />
                <span>Рулетка</span>
              </Link>
              <Link to="/dice" className="nav-link">
                <FontAwesomeIcon icon={faDice} />
                <span>Кости</span>
              </Link>
              <Link to="/rocket" className="nav-link">
                <FontAwesomeIcon icon={faRocket} />
                <span>Ракета</span>
              </Link>
            </>
          ) : null}
          <Link to="/leaderboard" className="nav-link">
            <FontAwesomeIcon icon={faTrophy} />
            <span>Лидеры</span>
          </Link>
        </div>
        {user && (
          <div className="navbar-actions" style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <Link to="/profile" className="nav-link" style={{marginRight:'10px'}}>
              <FontAwesomeIcon icon={faUser} />
              <span>Профиль</span>
            </Link>
            <div className="balance-info" style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <FontAwesomeIcon icon={faCoins} />
              <AnimatedBalance value={user.balance} /> монет
            </div>
            <button className="logout-btn" onClick={onLogout} style={{padding:'6px 14px',fontSize:'1rem'}}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Выйти
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 