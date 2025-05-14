import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Зевс Казино</h3>
          <p>Виртуальное казино для развлечения. Только для лиц старше 18 лет.</p>
        </div>
        <div className="footer-section">
          <h3>Игры</h3>
          <ul>
            <li>Слоты</li>
            <li>Рулетка</li>
            <li>Кости</li>
            <li><a href="/rocket">Ракета</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Контакты</h3>
          <ul>
            <li><a href="https://www.youtube.com/@hafri27" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Зевс Казино. Все права защищены.</p>
        <p>Автор: Морозов Михаил</p>
        <p>Данный проект — демо. Игра на виртуальные монеты, без реальных ставок. Играйте ответственно (нет, мне нужны все ваши деньги).</p>
      </div>
    </footer>
  );
}

export default Footer; 