const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// In-memory storage (replace with database in production)
const users = new Map();
const leaderboard = [];

// Create root user
const rootUser = {
  username: 'root',
  password: bcrypt.hashSync('1234', 10),
  balance: 1000000,
  gameHistory: []
};
users.set('root', rootUser);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err || !user || !user.username) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (users.has(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    balance: 1000,
    gameHistory: []
  };

  users.set(username, newUser);
  
  const token = jwt.sign({ username }, JWT_SECRET);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ message: 'Registration successful', balance: newUser.balance });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ message: 'Login successful', balance: user.balance });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/user', authenticateToken, (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = users.get(req.user.username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    username: user.username,
    balance: user.balance,
    gameHistory: user.gameHistory
  });
});

app.post('/api/update-balance', authenticateToken, (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { amount } = req.body;
  const user = users.get(req.user.username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.balance += amount;
  res.json({ balance: user.balance });
});

app.post('/api/add-game-history', authenticateToken, (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const gameData = req.body;
  const user = users.get(req.user.username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.gameHistory.unshift(gameData);
  if (user.gameHistory.length > 10) {
    user.gameHistory.pop();
  }

  // Update leaderboard
  const leaderboardEntry = {
    username: user.username,
    totalWins: user.gameHistory.filter(game => game.win > 0).length,
    totalWinAmount: user.gameHistory.reduce((sum, game) => sum + game.win, 0)
  };

  const existingEntryIndex = leaderboard.findIndex(entry => entry.username === user.username);
  if (existingEntryIndex !== -1) {
    leaderboard[existingEntryIndex] = leaderboardEntry;
  } else {
    leaderboard.push(leaderboardEntry);
  }

  // Sort leaderboard by total win amount
  leaderboard.sort((a, b) => b.totalWinAmount - a.totalWinAmount);

  res.json({ message: 'Game history updated' });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard.slice(0, 10)); // Return top 10 players
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 