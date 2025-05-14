import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const SlotSVG = () => (
  <svg width="100%" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="200" height="100" rx="18" fill="#22253a" stroke="#ffd700" strokeWidth="4"/>
    <rect x="35" y="40" width="40" height="60" rx="8" fill="#fff" stroke="#ffd700" strokeWidth="2"/>
    <rect x="90" y="40" width="40" height="60" rx="8" fill="#fff" stroke="#ffd700" strokeWidth="2"/>
    <rect x="145" y="40" width="40" height="60" rx="8" fill="#fff" stroke="#ffd700" strokeWidth="2"/>
    <circle cx="55" cy="70" r="10" fill="#ff3b3b"/>
    <circle cx="110" cy="70" r="10" fill="#3bff5a"/>
    <circle cx="165" cy="70" r="10" fill="#3bbcff"/>
    <rect x="100" y="10" width="20" height="16" rx="6" fill="#ffd700" stroke="#fff" strokeWidth="2"/>
  </svg>
);

const RouletteSVG = () => (
  <svg width="100%" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="110" cy="80" rx="80" ry="40" fill="#22253a" stroke="#ffd700" strokeWidth="4"/>
    <ellipse cx="110" cy="80" rx="60" ry="28" fill="#fff" stroke="#ffd700" strokeWidth="2"/>
    <ellipse cx="110" cy="80" rx="40" ry="16" fill="#e53935" stroke="#22253a" strokeWidth="2"/>
    <circle cx="110" cy="80" r="10" fill="#ffd700" stroke="#22253a" strokeWidth="2"/>
    <rect x="105" y="30" width="10" height="20" rx="3" fill="#ffd700" stroke="#fff" strokeWidth="2"/>
  </svg>
);

const DiceSVG = () => (
  <svg width="100%" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="40" width="50" height="50" rx="12" fill="#fff" stroke="#ffd700" strokeWidth="4"/>
    <rect x="110" y="60" width="50" height="50" rx="12" fill="#fff" stroke="#ffd700" strokeWidth="4"/>
    <circle cx="85" cy="65" r="5" fill="#22253a"/>
    <circle cx="135" cy="85" r="5" fill="#22253a"/>
    <circle cx="85" cy="90" r="5" fill="#22253a"/>
    <circle cx="135" cy="110" r="5" fill="#22253a"/>
    <circle cx="110" cy="65" r="5" fill="#22253a"/>
    <circle cx="110" cy="110" r="5" fill="#22253a"/>
  </svg>
);

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="home">
      <section className="hero compact-hero">
        <div className="hero-content compact-hero-content">
          <h1>Добро пожаловать в Zeus Casino</h1>
          <p>Погрузитесь в мир азарта и выигрышей</p>
          {user && (
            <div className="quick-balance">Ваш баланс: <b>{user.balance.toLocaleString()} монет</b></div>
          )}
          <div className="hero-buttons compact-hero-buttons">
            <Link to="/slot-machine" className="cta-button small">Играть в слоты</Link>
            <Link to="/roulette" className="cta-button small">Играть в рулетку</Link>
            <Link to="/dice" className="cta-button small">Играть в кости</Link>
            <Link to="/leaderboard" className="cta-button small">Лидеры</Link>
            {user && <Link to="/profile" className="cta-button small">Профиль</Link>}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Почему выбирают нас</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-bolt"></i>
            <h3>Мгновенные выигрыши</h3>
            <p>Получайте свои выигрыши мгновенно</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Безопасность</h3>
            <p>Ваша безопасность — наш приоритет</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-gift"></i>
            <h3>Бонусы</h3>
            <p>Регулярные бонусы и акции</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-headset"></i>
            <h3>Поддержка 24/7</h3>
            <p>Всегда на связи с вами</p>
          </div>
        </div>
      </section>

      <section className="games-preview">
        <h2>Наши игры</h2>
        <div className="games-grid">
          <div className="game-card">
            <div className="game-svg"><SlotSVG /></div>
            <div className="svg-caption">Слоты</div>
            <p>Классические слоты с множеством выигрышных комбинаций</p>
            <Link to="/slot-machine" className="play-button">Играть</Link>
          </div>
          <div className="game-card">
            <div className="game-svg"><RouletteSVG /></div>
            <div className="svg-caption">Рулетка</div>
            <p>Европейская рулетка с множеством ставок</p>
            <Link to="/roulette" className="play-button">Играть</Link>
          </div>
          <div className="game-card">
            <div className="game-svg"><DiceSVG /></div>
            <div className="svg-caption">Кости</div>
            <p>Классическая игра в кости с высокими выигрышами</p>
            <Link to="/dice" className="play-button">Играть</Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Готовы начать?</h2>
        <p>Присоединяйтесь к тысячам игроков уже сегодня</p>
        <Link to="/slot-machine" className="cta-button large">
          Начать игру
        </Link>
      </section>
    </div>
  );
};

export default Home; 