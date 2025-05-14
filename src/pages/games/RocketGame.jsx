import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import LightningBolt from '../../components/common/LightningBolt';
import './RocketGame.css';

const ROCKET_IMG = '/assets/rocket.png';
const ROCKET_IMG_WIDTH = 64;
const ROCKET_IMG_HEIGHT = 64;
const ROCKET_ANCHOR_X = 80; // Позиция ракеты по X (от левого края графика)
const GRAPH_HEIGHT = 160;
const X_TICK_STEP = 10;
const Y_TICK_STEP = 25;
const Y_MAX = 100;
const GLOW_COLORS = [
  '#ffd700', '#00fff7', '#ff4e00', '#ff00cc', '#00ff00', '#3bbcff', '#fffbe6', '#a259ff',
];

// Функция для генерации SVG-кривой (траектории)
function getFlightPath(xMax) {
  // Кривая: x = t*xMax, y = H - (t^1.7)*H*0.8
  const H = GRAPH_HEIGHT;
  let d = `M 30 ${H}`;
  for (let t = 0; t <= 1; t += 0.02) {
    const x = 30 + t * xMax;
    const y = H - Math.pow(t, 1.7) * H * 0.8;
    d += ` L ${x} ${y}`;
  }
  return d;
}

function getXTicks(xMax, offset) {
  // Динамические подписи по X (множитель)
  const ticks = [];
  const maxMult = Math.round(1 + 49 * ((xMax - 30) / (420 - 30)));
  for (let mult = 1; mult <= maxMult + X_TICK_STEP; mult += X_TICK_STEP) {
    // t — нормированная позиция множителя
    const t = (mult - 1) / 49;
    const x = 30 + t * xMax - offset;
    if (x >= 30 - offset && x <= 30 - offset + 420) {
      ticks.push({ x, mult });
    }
  }
  return ticks;
}

function getYTicks(offset) {
  // Динамические подписи по Y (высота)
  const H = GRAPH_HEIGHT;
  const ticks = [];
  for (let val = 0; val <= Y_MAX; val += Y_TICK_STEP) {
    const y = H - (val / Y_MAX) * H * 0.8;
    ticks.push({ y, val });
  }
  return ticks;
}

function getRocketPosition(multiplier, xMax) {
  const maxMultiplier = 50;
  let t = Math.log(multiplier) / Math.log(maxMultiplier);
  t = Math.max(0, Math.min(1, t));
  const H = GRAPH_HEIGHT;
  const x = 30 + t * xMax;
  const y = H - H * t;
  return { x, y };
}

const RocketFlame = ({ flying }) => (
  <svg className={`rocket-flame-svg${flying ? ' flying' : ''}`} width="32" height="40" viewBox="0 0 32 40">
    <radialGradient id="flameGrad" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stopColor="#fffbe6" stopOpacity="1" />
      <stop offset="60%" stopColor="#ffd700" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#ff4e00" stopOpacity="0.2" />
    </radialGradient>
    <ellipse cx="16" cy="32" rx="10" ry="16" fill="url(#flameGrad)" opacity="0.8">
      <animate attributeName="rx" values="10;14;10" dur="0.5s" repeatCount="indefinite" />
      <animate attributeName="ry" values="16;22;16" dur="0.5s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="16" cy="36" rx="5" ry="8" fill="#ffd700" opacity="0.7">
      <animate attributeName="rx" values="5;8;5" dur="0.4s" repeatCount="indefinite" />
      <animate attributeName="ry" values="8;12;8" dur="0.4s" repeatCount="indefinite" />
    </ellipse>
  </svg>
);

const RocketGame = () => {
  const { user, updateBalance } = useAuth();
  const balance = user?.balance || 0;
  const [bet, setBet] = useState('');
  const [inGame, setInGame] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [crashAt, setCrashAt] = useState(null);
  const [cashedOut, setCashedOut] = useState(false);
  const [result, setResult] = useState(null);
  const [flying, setFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [crashAnim, setCrashAnim] = useState(false);
  const [betWarning, setBetWarning] = useState('');
  const intervalRef = useRef();
  const [xMax, setXMax] = useState(420);
  const [tick, setTick] = useState(0);
  const [glowColor, setGlowColor] = useState('#ffd700');

  const startGame = () => {
    const betNum = Number(bet);
    if (!betNum || isNaN(betNum) || betNum <= 0 || betNum > balance) return;
    const newColor = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
    setGlowColor(newColor);
    updateBalance(-betNum);
    setInGame(true);
    setMultiplier(1);
    setCrashAt(getRandomCrash());
    setCashedOut(false);
    setResult(null);
    setFlying(true);
    setCrashed(false);
    setCrashAnim(false);
    setXMax(420);
    setTick(0);
    intervalRef.current = setInterval(() => {
      setMultiplier(m => {
        // Медленный рост
        const next = +(m * 1.008 + 0.002).toFixed(3);
        return next;
      });
      setXMax(x => Math.min(x + 1, 1200)); // график сдвигается медленнее
      setTick(t => t + 1);
    }, 40);
  };

  React.useEffect(() => {
    if (!inGame) return;
    if (crashAt === null) return; // crashAt должен быть определён
    if (multiplier >= crashAt) {
      clearInterval(intervalRef.current);
      setFlying(false);
      setCrashed(true);
      setCrashAnim(true);
      setTimeout(() => {
        setResult('Проигрыш! Ракета взорвалась на x' + (crashAt !== null ? crashAt.toFixed(2) : '??'));
        setInGame(false);
        setCrashAnim(false);
        // Автоматически сбрасываем игру через 1.5 секунды
        setTimeout(() => {
          reset();
        }, 1500);
      }, 900);
    }
  }, [multiplier, crashAt, inGame]);

  const cashOut = () => {
    if (!inGame || cashedOut) return;
    clearInterval(intervalRef.current);
    setCashedOut(true);
    setFlying(false);
    setTimeout(() => {
      const win = Number(bet) * multiplier;
      updateBalance(win);
      setResult('Вы выиграли: ' + win.toFixed(2) + ' монет (x' + multiplier.toFixed(2) + ')');
      setInGame(false);
    }, 600);
  };

  const reset = () => {
    setMultiplier(1);
    setCrashAt(null);
    setCashedOut(false);
    setResult(null);
    setFlying(false);
    setCrashed(false);
    setCrashAnim(false);
    setBetWarning('');
    setXMax(420);
  };

  // Положение ракеты по кривой
  const { x, y } = getRocketPosition(multiplier, xMax);
  const offset = x > ROCKET_ANCHOR_X ? x - ROCKET_ANCHOR_X : 0;
  const viewBoxLeft = offset;
  const viewBoxWidth = 420;
  const viewBox = `${viewBoxLeft} 0 ${viewBoxWidth} ${GRAPH_HEIGHT}`;

  // После взрыва ракета и огонь не отображаются только во время анимации взрыва или после краша
  const showRocket = inGame || crashAnim;
  const showMultiplier = inGame || crashAnim;
  const displayMultiplier = showRocket ? multiplier : (crashAt !== null ? crashAt : 1);
  const displayXMax = showRocket ? xMax : xMax;
  const { x: displayX, y: displayY } = getRocketPosition(displayMultiplier, displayXMax);
  const displayOffset = displayX > ROCKET_ANCHOR_X ? displayX - ROCKET_ANCHOR_X : 0;
  const displayViewBoxLeft = displayOffset;
  const displayViewBox = `${displayViewBoxLeft} 0 ${viewBoxWidth} ${GRAPH_HEIGHT}`;

  // Для rocket-img-wrap: left и bottom вычисляются по x и y (без anchor)
  const rocketLeft = displayX - ROCKET_IMG_WIDTH / 2;
  const rocketBottom = Math.max(displayY - 8, 0);

  return (
    <div className="rocket-game">
      <LightningBolt side="left" color={glowColor} />
      <LightningBolt side="right" color={glowColor} />
      <h1>Ракета Зевса</h1>
      <div className="rocket-balance">Баланс: <b>{balance.toFixed(2)}</b> монет</div>
      <div className="rocket-controls">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min="1"
          max={balance}
          placeholder="Сумма ставки"
          value={bet}
          disabled={inGame}
          onChange={e => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 4) val = val.slice(0, 4);
            setBet(val);
            if (Number(val) > 9999) {
              setBetWarning('Максимальная ставка — 9999');
            } else {
              setBetWarning('');
            }
          }}
        />
        {betWarning && <div className="bet-warning">{betWarning}</div>}
        {!inGame && (
          <button className="rocket-btn" onClick={startGame} disabled={!bet || Number(bet) <= 0 || Number(bet) > balance || Number(bet) > 9999}>Полететь!</button>
        )}
        {inGame && !cashedOut && !crashAnim && crashAt !== null && multiplier < crashAt && !result && (
          <button className="rocket-btn cashout" onClick={cashOut}>Забрать (x{multiplier.toFixed(2)})</button>
        )}
        {inGame && !crashAnim && result && (
          <button className="rocket-btn" onClick={reset}>Новая игра</button>
        )}
      </div>
      <div className={`rocket-area${crashAnim ? ' rocket-crash' : ''}`}>
        <div className="rocket-bg-epilepsy">
          <svg width="100%" height="100%" viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="epilepsy1" x1="0" y1="0" x2="420" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff00cc" />
                <stop offset="1" stopColor="#00fff7" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="100" r="38" fill="url(#epilepsy1)" opacity="0.45" />
            <rect x="220" y="40" width="120" height="30" rx="16" fill="#ffd700" opacity="0.18" />
            <ellipse cx="320" cy="120" rx="38" ry="18" fill="#ff4e00" opacity="0.22" />
            <rect x="60" y="120" width="60" height="18" rx="9" fill="#00fff7" opacity="0.18" />
            <ellipse cx="200" cy="60" rx="22" ry="12" fill="#fffbe6" opacity="0.13" />
          </svg>
        </div>
        <div className="rainbow-overlay"></div>
        <div className="rocket-bg-glitch"></div>
        <div className="rocket-bg-flash"></div>
        <svg
          width={viewBoxWidth}
          height={GRAPH_HEIGHT}
          className="rocket-curve-svg"
          viewBox={`0 0 ${viewBoxWidth} ${GRAPH_HEIGHT}`}
          style={{ display: 'block' }}
        >
          {/* Оси X и Y */}
          {getXTicks(xMax, 0).map(tick => (
            <text key={tick.x} x={tick.x} y={155} fontSize="13" fill="#ffd70099" textAnchor="middle">x{tick.mult}</text>
          ))}
          {getYTicks(0).map(tick => (
            <text key={tick.y} x={18} y={tick.y + 6} fontSize="13" fill="#ffd70099" textAnchor="end">{tick.val}</text>
          ))}
          <path d={getFlightPath(xMax)} stroke="#ffd700" strokeWidth="3" fill="none" opacity="0.5" />
        </svg>
        {showRocket && (
          <div
            className={`rocket-img-wrap${flying ? ' flying' : ''}${crashed ? ' crashed' : ''}${crashAnim ? ' crash-anim' : ''}`}
            style={{ left: rocketLeft, bottom: rocketBottom }}
          >
            <RocketFlame flying={flying} />
            <img
              src={ROCKET_IMG}
              alt="Ракета Зевса"
              className="rocket-img"
              draggable={false}
              style={{ width: ROCKET_IMG_WIDTH, height: ROCKET_IMG_HEIGHT }}
            />
          </div>
        )}
        {crashAnim && <div className="rocket-explosion" style={{ left: rocketLeft, bottom: rocketBottom }} />}
        {showMultiplier && (
          <div className="rocket-multiplier" style={{ left: displayX + 38, bottom: displayY + 10 }}>
            x{displayMultiplier?.toFixed(2)}
          </div>
        )}
      </div>
      {result && <div className={`rocket-result${result.includes('выиграли') ? ' win' : ' lose'}`}>{result}</div>}
      <div className="rocket-rules">
        <b>Правила:</b> Сделайте ставку, нажмите «Полететь!». Заберите выигрыш до взрыва ракеты. Чем дольше летит ракета — тем выше множитель, но если не успеете — ставка сгорит!
      </div>
    </div>
  );
};

function getRandomCrash() {
  const r = Math.random();
  return Math.max(1.1, Math.floor((-1 / Math.log(r)) * 100) / 100);
}

export default RocketGame;