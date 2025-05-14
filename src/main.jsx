import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Styles
import './index.css'
import './App.css'
import './components/common/Navbar.css'
import './components/common/Footer.css'
import './pages/Home.css'
import './pages/games/SlotMachine.css'
import './pages/games/Roulette.css'
import './pages/games/Dice.css'
import './pages/Profile.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
