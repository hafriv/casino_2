import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faHistory, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const balance = user?.balance || 0;
  const gameHistory = user?.gameHistory || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateStats = () => {
    const totalBets = gameHistory.length;
    const totalWins = gameHistory.filter(game => game.win > 0).length;
    const totalWinAmount = gameHistory.reduce((sum, game) => sum + game.win, 0);
    const totalBetAmount = gameHistory.reduce((sum, game) => sum + game.bet, 0);
    const winRate = totalBets > 0 ? (totalWins / totalBets * 100).toFixed(1) : 0;

    return {
      totalBets,
      totalWins,
      totalWinAmount,
      totalBetAmount,
      winRate
    };
  };

  const stats = calculateStats();

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Профиль игрока</h1>
        <div className="balance-display">
          <FontAwesomeIcon icon={faCoins} className="balance-icon" />
          <span>{balance.toLocaleString()} монет</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего ставок</h3>
          <p>{stats.totalBets}</p>
        </div>
        <div className="stat-card">
          <h3>Процент побед</h3>
          <p>{stats.winRate}%</p>
        </div>
        <div className="stat-card">
          <h3>Всего побед</h3>
          <p>{stats.totalWins}</p>
        </div>
        <div className="stat-card">
          <h3>Чистая прибыль</h3>
          <p className={stats.totalWinAmount - stats.totalBetAmount >= 0 ? 'profit' : 'loss'}>
            {(stats.totalWinAmount - stats.totalBetAmount).toLocaleString()} монет
          </p>
        </div>
      </div>

      <div className="game-history">
        <h2>
          <FontAwesomeIcon icon={faHistory} />
          История игр
        </h2>
        {gameHistory.length > 0 ? (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Игра</th>
                  <th>Ставка</th>
                  <th>Выигрыш</th>
                  <th>Результат</th>
                  <th>Время</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, index) => (
                  <tr key={index}>
                    <td>{game.game}</td>
                    <td>{game.bet}</td>
                    <td className={game.win > 0 ? 'win' : 'loss'}>
                      {game.win > 0 ? '+' : ''}{game.win}
                    </td>
                    <td>{game.result || '-'}</td>
                    <td>{formatDate(game.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-history">Пока нет сыгранных игр</p>
        )}
      </div>

      <div className="achievements">
        <h2>
          <FontAwesomeIcon icon={faTrophy} />
          Достижения
        </h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <h3>Первая победа</h3>
            <p>Выиграйте свою первую игру</p>
            <div className="achievement-status">
              {stats.totalWins > 0 ? 'Выполнено' : 'Не выполнено'}
            </div>
          </div>
          <div className="achievement-card">
            <h3>Крупная ставка</h3>
            <p>Сделайте ставку на 500 монет</p>
            <div className="achievement-status">
              {stats.totalBetAmount >= 500 ? 'Выполнено' : 'Не выполнено'}
            </div>
          </div>
          <div className="achievement-card">
            <h3>Удачная серия</h3>
            <p>Выиграйте 3 игры подряд</p>
            <div className="achievement-status">
              {stats.totalWins >= 3 ? 'Выполнено' : 'Не выполнено'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 