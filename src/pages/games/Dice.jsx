import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faDice } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import LightningBolt from '../../components/common/LightningBolt';

const BET_AMOUNTS = [10, 50, 100, 500];
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const GLOW_COLORS = [
  '#ffd700', // gold
  '#00fff7', // cyan
  '#ff4e00', // orange
  '#ff00cc', // pink
  '#00ff00', // green
  '#3bbcff', // blue
  '#fffbe6', // white-yellow
  '#a259ff', // purple
];

function Dice() {
  const { user, updateBalance, addGameHistory } = useAuth();
  const balance = user?.balance || 0;
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0]);
  const [rolling, setRolling] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [lastRoll, setLastRoll] = useState(null);
  const [glowColor, setGlowColor] = useState('#ffd700');

  const rollDice = () => {
    if (rolling || balance < betAmount) return;

    const newColor = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
    setGlowColor(newColor);
    setRolling(true);
    setWinAmount(0);
    updateBalance(-betAmount);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount > 10) {
        clearInterval(rollInterval);
        const finalDice1 = Math.floor(Math.random() * 6) + 1;
        const finalDice2 = Math.floor(Math.random() * 6) + 1;
        const sum = finalDice1 + finalDice2;

        setDice1(finalDice1);
        setDice2(finalDice2);
        setLastRoll(sum);

        // Win on 7 or 11
        if (sum === 7 || sum === 11) {
          const win = betAmount * 2;
          setWinAmount(win);
          updateBalance(win);
          addGameHistory({
            game: 'Кости',
            bet: betAmount,
            win: win,
            result: sum,
            timestamp: new Date().toISOString()
          }, true);
        }

        setRolling(false);
      }
    }, 100);
  };

  return (
    <div className="dice-game" style={{ '--dice-glow': glowColor }}>
      <LightningBolt side="left" color={glowColor} />
      <LightningBolt side="right" color={glowColor} />
      <div className="dice-display">
        <div className={`dice ${rolling ? 'rolling' : ''}`}>
          {DICE_FACES[dice1 - 1]}
        </div>
        <div className={`dice ${rolling ? 'rolling' : ''}`}>
          {DICE_FACES[dice2 - 1]}
        </div>
      </div>

      <div className="dice-controls">
        <div className="bet-controls">
          {BET_AMOUNTS.map(amount => (
            <button
              key={amount}
              className={`btn ${betAmount === amount ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setBetAmount(amount)}
              disabled={rolling}
            >
              {amount}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary roll-button"
          onClick={rollDice}
          disabled={rolling || balance < betAmount}
        >
          {rolling ? (
            <FontAwesomeIcon icon={faDice} className="spin" />
          ) : (
            <>
              <FontAwesomeIcon icon={faCoins} />
              БРОСИТЬ ({betAmount})
            </>
          )}
        </button>
      </div>

      {lastRoll !== null && (
        <div className="result">
          <h2>Сумма: {lastRoll}</h2>
          {winAmount > 0 ? (
            <div className="win-message">
              <h3>ПОБЕДА!</h3>
              <p>{winAmount} монет</p>
            </div>
          ) : (
            <p className="lose-message">Попробуйте ещё раз!</p>
          )}
        </div>
      )}

      <div className="rules">
        <h3>Правила:</h3>
        <ul>
          <li>Выпадет 7 или 11 — вы выиграли!</li>
          <li>Выигрыш: 2x от ставки</li>
          <li>Любое другое число — проигрыш</li>
        </ul>
      </div>
    </div>
  );
}

export default Dice; 