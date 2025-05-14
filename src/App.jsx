import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import BackgroundParticles from './components/common/BackgroundParticles';
import React, { useState, useEffect } from 'react';
import LoaderScreen from './components/common/LoaderScreen';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SlotMachine from './pages/games/SlotMachine';
import Roulette from './pages/games/Roulette';
import Dice from './pages/games/Dice';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import RocketGame from './pages/games/RocketGame';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WinEffectZeus from './components/common/WinEffectZeus';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  const { user, logout, winEffect, clearWinEffect } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    const timer = setTimeout(() => setShowLoader(false), 750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      {showLoader && <LoaderScreen onFinish={() => setShowLoader(false)} />}
      {!showLoader && (
        <>
          <Navbar user={user} onLogout={logout} />
          <main className="main-content">
            <BackgroundParticles />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/slot-machine" element={
                <ProtectedRoute>
                  <SlotMachine />
                </ProtectedRoute>
              } />
              <Route path="/roulette" element={
                <ProtectedRoute>
                  <Roulette />
                </ProtectedRoute>
              } />
              <Route path="/dice" element={
                <ProtectedRoute>
                  <Dice />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/rocket" element={
                <ProtectedRoute>
                  <RocketGame />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          {winEffect && <WinEffectZeus onEnd={clearWinEffect} />}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
