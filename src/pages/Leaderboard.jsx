import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const intervalRef = useRef();

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/leaderboard');
      setLeaderboard(response.data);
      setError('');
    } catch (error) {
      setError('Не удалось загрузить таблицу лидеров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(intervalRef.current);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">Загрузка таблицы лидеров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1>
          <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
          Лучшие игроки
          <button
            className="refresh-btn"
            onClick={fetchLeaderboard}
            title="Обновить"
            style={{
              marginLeft: 16,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent-gold)',
              fontSize: '1.2rem'
            }}
          >
            <FontAwesomeIcon icon={faSyncAlt} spin={loading} />
          </button>
        </h1>

        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Место</th>
                <th>Игрок</th>
                <th>Побед</th>
                <th>Сумма выигрышей</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={player.username} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td>
                    {index < 3 ? (
                      <FontAwesomeIcon icon={faMedal} className={`medal-${index + 1}`} />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td>{player.username}</td>
                  <td>{player.totalWins}</td>
                  <td>{player.totalWinAmount.toLocaleString()} монет</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="no-data">
            Пока нет игроков в таблице лидеров. Станьте первым!
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard; 