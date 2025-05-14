import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import winTrack from '/assets/win-dubstep.mp3';
import LightningBolt from '../../components/common/LightningBolt';

// константы

const SYMBOLS = ['🍒', '🍊', '🍋', '🍇', '💎', '7️⃣'];
const REELS = 3;
const ROWS = 3;
const BET_AMOUNTS = [10, 50, 100, 500];
const SPIN_COUNTS = [1, 5, 10];
const GLOW_COLORS = [
  '#ffd700', 
  '#00fff7', 
  '#ff4e00', 
  '#ff00cc', 
  '#00ff00', 
  '#3bbcff', 
  '#fffbe6', 
  '#a259ff', 
];

function SlotMachine() {
  const { user, updateBalance, addGameHistory } = useAuth();
  const balance = user?.balance || 0;
  const [reels, setReels] = useState(Array(REELS).fill(Array(ROWS).fill(SYMBOLS[0])));
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0]);
  const [winAmount, setWinAmount] = useState(0);
  const [winLines, setWinLines] = useState([]);
  const [spinCount, setSpinCount] = useState(1);
  const [spinResults, setSpinResults] = useState([]);
  const [totalWin, setTotalWin] = useState(0);
  const [glowColor, setGlowColor] = useState('#ffd700');
  const [glowTransition, setGlowTransition] = useState(false);
  const glowTimeout = useRef(null);
  const glowAnimationFrame = useRef(null);
  const targetGlowColor = useRef('#ffd700');
  const startGlowColor = useRef('#ffd700');
  const startTime = useRef(0);
  const DURATION = 180; // ms

  const generateRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const checkWin = (result) => {
    let totalWin = 0;
    const lines = [];
    for (let row = 0; row < ROWS; row++) {
      const line = result.map(reel => reel[row]);
      if (line.every(symbol => symbol === line[0])) {
        const symbolIndex = SYMBOLS.indexOf(line[0]);
        const win = betAmount * (symbolIndex + 1) * 2;
        totalWin += win;
        lines.push({ row, type: 'horizontal', win });
      }
    }
    const diagonal1 = [result[0][0], result[1][1], result[2][2]];
    const diagonal2 = [result[0][2], result[1][1], result[2][0]];
    if (diagonal1.every(symbol => symbol === diagonal1[0])) {
      const symbolIndex = SYMBOLS.indexOf(diagonal1[0]);
      const win = betAmount * (symbolIndex + 1) * 3;
      totalWin += win;
      lines.push({ type: 'diagonal1', win });
    }
    if (diagonal2.every(symbol => symbol === diagonal2[0])) {
      const symbolIndex = SYMBOLS.indexOf(diagonal2[0]);
      const win = betAmount * (symbolIndex + 1) * 3;
      totalWin += win;
      lines.push({ type: 'diagonal2', win });
    }
    return { totalWin, lines };
  };

  const updateGlowColor = (timestamp) => {
    if (!startTime.current) startTime.current = timestamp;
    const elapsed = timestamp - startTime.current;
    const progress = Math.min(elapsed / DURATION, 1);
    const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const r1 = parseInt(startGlowColor.current.slice(1, 3), 16);
    const g1 = parseInt(startGlowColor.current.slice(3, 5), 16);
    const b1 = parseInt(startGlowColor.current.slice(5, 7), 16);
    const r2 = parseInt(targetGlowColor.current.slice(1, 3), 16);
    const g2 = parseInt(targetGlowColor.current.slice(3, 5), 16);
    const b2 = parseInt(targetGlowColor.current.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * easeProgress);
    const g = Math.round(g1 + (g2 - g1) * easeProgress);
    const b = Math.round(b1 + (b2 - b1) * easeProgress);
    const newColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setGlowColor(newColor);
    if (progress < 1) {
      glowAnimationFrame.current = requestAnimationFrame(updateGlowColor);
    } else {
      setGlowTransition(false);
      startTime.current = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (glowAnimationFrame.current) {
        cancelAnimationFrame(glowAnimationFrame.current);
      }
    };
  }, []);

  // Мультиспин
  const spinMultiple = async (count) => {
    // Плавная смена цвета glow
    if (glowAnimationFrame.current) {
      cancelAnimationFrame(glowAnimationFrame.current);
    }
    setGlowTransition(true);
    startGlowColor.current = glowColor;
    targetGlowColor.current = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
    startTime.current = 0;
    glowAnimationFrame.current = requestAnimationFrame(updateGlowColor);
    setSpinning(true);
    setSpinResults([]);
    setTotalWin(0);
    let accumulatedWin = 0;
    let results = [];
    let currentBalance = balance;
    if (currentBalance < betAmount * count) {
      setSpinning(false);
      return;
    }
    for (let i = 0; i < count; i++) {
      setReels(Array(REELS).fill(Array(ROWS).fill(SYMBOLS[0])));
      await new Promise(res => setTimeout(res, 350));
      const finalResult = Array(REELS).fill(null).map(() => 
        Array(ROWS).fill(null).map(() => generateRandomSymbol())
      );
      setReels(finalResult);
      const { totalWin, lines } = checkWin(finalResult);
      accumulatedWin += totalWin;
      results.push({ finalResult, totalWin, lines });
      setSpinResults([...results]);
      setTotalWin(accumulatedWin);
      if (totalWin > 0) {
        updateBalance(totalWin);
        addGameHistory({
          game: 'Слоты',
          bet: betAmount,
          win: totalWin,
          timestamp: new Date().toISOString()
        }, true);
      }
    }
    updateBalance(accumulatedWin - betAmount * count);
    setWinAmount(accumulatedWin);
    setSpinning(false);
  };

  return (
    <div className={`slot-machine${glowTransition ? ' fade-glow' : ''}`} style={{ '--slot-glow': glowColor }}>
      <LightningBolt side="left" color={glowColor} />
      <LightningBolt side="right" color={glowColor} />
      <div className="slot-display">
        {reels.map((reel, reelIndex) => (
          <div key={reelIndex} className="reel">
            {reel.map((symbol, symbolIndex) => (
              <div 
                key={symbolIndex} 
                className={`symbol ${spinning ? 'spinning' : ''}`}
              >
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="slot-controls">
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
          <span style={{color:'#ffd700',marginRight:8}}>Количество прокрутов:</span>
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
          disabled={spinning || balance < betAmount * spinCount}
        >
          {spinning ? (
            <FontAwesomeIcon icon={faSpinner} className="spin" />
          ) : (
            <>
              <FontAwesomeIcon icon={faCoins} />
              {spinCount > 1 ? `КРУТИТЬ (${spinCount} раз)` : `КРУТИТЬ (${betAmount})`}
            </>
          )}
        </button>
      </div>
      {totalWin > 0 && (
        <div className="win-message">
          <h2>ПОБЕДА!</h2>
          <p>{totalWin} монет</p>
          {spinResults.map((res, idx) => (
            <div key={idx} className="win-line">
              {res.lines && res.lines.length > 0
                ? res.lines.map((line, i) => (
                    <span key={i}>{line.type === 'horizontal' ? `Горизонтальная линия ${line.row + 1}` : line.type === 'diagonal1' ? 'Главная диагональ' : 'Побочная диагональ'}: {line.win} монет; </span>
                  ))
                : <span>Без выигрыша</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SlotMachine; 