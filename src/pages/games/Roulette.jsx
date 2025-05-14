import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import LightningBolt from '../../components/common/LightningBolt';

const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BET_AMOUNTS = [10, 50, 100, 500];
const SPIN_COUNTS = [1, 5, 10];

const BET_TYPES = {
  straight: { name: 'Одиночное число', multiplier: 35 },
  red: { name: 'Красное', multiplier: 1 },
  black: { name: 'Чёрное', multiplier: 1 },
  even: { name: 'Чётное', multiplier: 1 },
  odd: { name: 'Нечётное', multiplier: 1 },
  high: { name: 'Большие (19-36)', multiplier: 1 },
  low: { name: 'Малые (1-18)', multiplier: 1 }
};

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

function Roulette() {
  const { user, updateBalance, addGameHistory } = useAuth();
  const balance = user?.balance || 0;
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0]);
  const [bets, setBets] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  const [spinCount, setSpinCount] = useState(1);
  const [spinResults, setSpinResults] = useState([]);
  const [totalWin, setTotalWin] = useState(0);
  const [glowColor, setGlowColor] = useState('#ffd700');
  const [appear, setAppear] = useState(false);

  useEffect(() => { setAppear(true); }, []);

  const isRed = (number) => RED_NUMBERS.includes(number);
  const isBlack = (number) => number !== 0 && !isRed(number);

  const placeBet = (type, value) => {
    if (spinning) return;
    const existingBet = bets.find(bet => bet.type === type && bet.value === value);
    if (existingBet) {
      setBets(bets.filter(bet => bet !== existingBet));
    } else {
      setBets([...bets, { type, value, amount: betAmount }]);
    }
  };

  const calculateWinnings = (winningNumber) => {
    let totalWin = 0;
    const winningBets = [];
    bets.forEach(bet => {
      let win = 0;
      switch (bet.type) {
        case 'straight':
          if (bet.value === winningNumber) {
            win = bet.amount * BET_TYPES.straight.multiplier;
          }
          break;
        case 'red':
          if (isRed(winningNumber)) {
            win = bet.amount * BET_TYPES.red.multiplier;
          }
          break;
        case 'black':
          if (isBlack(winningNumber) && winningNumber !== 0) {
            win = bet.amount * BET_TYPES.black.multiplier;
          }
          break;
        case 'even':
          if (winningNumber !== 0 && winningNumber % 2 === 0) {
            win = bet.amount * BET_TYPES.even.multiplier;
          }
          break;
        case 'odd':
          if (winningNumber % 2 === 1) {
            win = bet.amount * BET_TYPES.odd.multiplier;
          }
          break;
        case 'high':
          if (winningNumber >= 19) {
            win = bet.amount * BET_TYPES.high.multiplier;
          }
          break;
        case 'low':
          if (winningNumber >= 1 && winningNumber <= 18) {
            win = bet.amount * BET_TYPES.low.multiplier;
          }
          break;
      }
      if (win > 0) {
        totalWin += win;
        winningBets.push({ type: bet.type, value: bet.value, win });
      }
    });
    return { totalWin, winningBets };
  };

  // Мультиспин
  const spinMultiple = async (count) => {
    // Меняем цвет glow при каждом запуске
    const newColor = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
    setGlowColor(newColor);
    setSpinning(true);
    setSpinResults([]);
    setTotalWin(0);
    let accumulatedWin = 0;
    let results = [];
    let currentBalance = balance;
    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (currentBalance < totalBet * count) {
      setSpinning(false);
      return;
    }
    for (let i = 0; i < count; i++) {
      setSelectedNumber(null);
      await new Promise(res => setTimeout(res, 400));
      const winningNumber = Math.floor(Math.random() * 37);
      setSelectedNumber(winningNumber);
      setResult(winningNumber);
      const { totalWin, winningBets } = calculateWinnings(winningNumber);
      accumulatedWin += totalWin;
      results.push({ winningNumber, totalWin, winningBets });
      currentBalance -= totalBet;
      if (totalWin > 0) {
        currentBalance += totalWin;
      }
      setSpinResults([...results]);
      setTotalWin(accumulatedWin);
      if (totalWin > 0) {
        addGameHistory({
          game: 'Рулетка',
          bet: totalBet,
          win: totalWin,
          result: winningNumber,
          timestamp: new Date().toISOString()
        }, true);
      }
    }
    updateBalance(accumulatedWin - totalBet * count);
    setSpinning(false);
    setBets([]);
  };

  return (
    <div className="roulette" style={{ '--dice-glow': glowColor }}>
      <LightningBolt side="left" color={glowColor} />
      <LightningBolt side="right" color={glowColor} />
      <div className={`roulette-wheel${appear ? ' roulette-appear' : ''}`}>
        <div className="wheel-numbers">
          {NUMBERS.map((number, idx) => (
            <button
              key={number}
              className={`number ${isRed(number) ? 'red' : isBlack(number) ? 'black' : 'green'} \
                ${selectedNumber === number ? 'selected' : ''} roulette-tile-appear`}
              style={{ animationDelay: `${0.1 + idx * 0.035}s` }}
              onClick={() => placeBet('straight', number)}
              disabled={spinning}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      <div className="betting-options">
        <div className="bet-types">
          {Object.entries(BET_TYPES).map(([type, { name, multiplier }]) => (
            <button
              key={type}
              className={`bet-type ${bets.some(bet => bet.type === type) ? 'selected' : ''}`}
              onClick={() => placeBet(type)}
              disabled={spinning}
            >
              {name} (x{multiplier})
            </button>
          ))}
        </div>

        <div className="bet-controls">
          {BET_AMOUNTS.map(amount => (
            <button
              key={amount}
              className={`btn ${betAmount === amount ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setBetAmount(amount)}
              disabled={spinning}
            >
              {amount}
            </button>
          ))}
        </div>

        <div className="spin-controls">
          <span style={{color:'#ffd700',marginRight:8}}>Количество прокруток:</span>
          {SPIN_COUNTS.map(cnt => (
            <button
              key={cnt}
              className={`btn ${spinCount === cnt ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSpinCount(cnt)}
              disabled={spinning}
            >
              {cnt}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary spin-button"
          onClick={() => spinMultiple(spinCount)}
          disabled={spinning || bets.length === 0}
        >
          {spinning ? (
            <FontAwesomeIcon icon={faSpinner} className="spin" />
          ) : (
            <>
              <FontAwesomeIcon icon={faCoins} />
              {spinCount > 1 ? `ПРОКРУТИТЬ (${spinCount} раз)` : 'ПРОКРУТИТЬ'}
            </>
          )}
        </button>
      </div>

      {spinResults.length > 0 && (
        <div className="result">
          <h2>Результаты:</h2>
          <ul style={{textAlign:'left'}}>
            {spinResults.map((res, idx) => (
              <li key={idx}>
                <b>Прокрутка {idx+1}:</b> Выпало <b>{res.winningNumber}</b> {res.totalWin > 0 ? `— выигрыш: ${res.totalWin}` : '— без выигрыша'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:8}}>
            <b>Общий выигрыш: {totalWin}</b>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roulette; 