import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="logo">
          <Link to="/">Зевс Казино</Link>
        </div>
        <nav className="main-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Главная
          </Link>
          <Link to="/slots" className={location.pathname === '/slots' ? 'active' : ''}>
            Слоты
          </Link>
          <Link to="/roulette" className={location.pathname === '/roulette' ? 'active' : ''}>
            Рулетка
          </Link>
          <Link to="/dice" className={location.pathname === '/dice' ? 'active' : ''}>
            Кости
          </Link>
        </nav>
        <div className="social-links">
          <a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer" title="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer" title="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer" title="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>О нас</h3>
            <p>Зевс Казино — ваш надежный партнёр в мире азартных игр.</p>
          </div>
          <div className="footer-section">
            <h3>Контакты</h3>
            <p>Email: support@zeuscasino.com</p>
          </div>
          <div className="footer-section">
            <h3>Социальные сети</h3>
            <div className="social-links">
              <a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer" title="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Зевс Казино. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 