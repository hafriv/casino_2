# Casino Royale

A virtual casino experience built with React and Vite. Play various casino games with virtual chips, track your progress, and compete for achievements.

## Features

- 🎰 Slot Machine with multiple paylines
- 🎲 European Roulette with various betting options
- 🎯 Dice game with simple rules
- 💰 Virtual currency system
- 📊 Player statistics and achievements
- 📱 Responsive design for mobile and desktop
- 🎨 Modern UI with animations and effects

## Tech Stack

- React 18+
- Vite 5+
- React Router v6
- Font Awesome Icons
- CSS3 with custom properties

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/casino-royale.git
cd casino-royale
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

## Game Rules

### Slot Machine
- Match symbols on horizontal or diagonal lines
- Higher value symbols pay more
- Multiple paylines for increased winning chances

### Roulette
- European style (0-36)
- Various betting options (straight, red/black, even/odd, etc.)
- Different multipliers for different bet types

### Dice
- Roll two dice
- Win on 7 or 11
- 2x payout on wins

## Project Structure

```
src/
  ├── components/
  │   └── common/
  │       ├── Navbar.jsx
  │       └── Footer.jsx
  ├── pages/
  │   ├── Home.jsx
  │   ├── Profile.jsx
  │   └── games/
  │       ├── SlotMachine.jsx
  │       ├── Roulette.jsx
  │       └── Dice.jsx
  ├── App.jsx
  └── main.jsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is a demo project for entertainment purposes only. No real money is involved. Play responsibly.
