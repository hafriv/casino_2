import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winEffect, setWinEffect] = useState(false);
  const pollingRef = useRef();

  useEffect(() => {
    checkAuth();
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(checkAuth, 5000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user', {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', 
        { username, password },
        { withCredentials: true }
      );
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/register', 
        { username, password },
        { withCredentials: true }
      );
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/api/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Logout failed' 
      };
    }
  };

  const updateBalance = async (amount) => {
    try {
      const response = await axios.post('http://localhost:3001/api/update-balance',
        { amount },
        { withCredentials: true }
      );
      setUser(prev => ({ ...prev, balance: response.data.balance }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update balance' 
      };
    }
  };

  const addGameHistory = async (gameData, triggerWinEffect = false) => {
    try {
      await axios.post('http://localhost:3001/api/add-game-history',
        gameData,
        { withCredentials: true }
      );
      await checkAuth();
      if (triggerWinEffect) setWinEffect(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update game history' 
      };
    }
  };

  const clearWinEffect = () => setWinEffect(false);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateBalance,
      addGameHistory,
      winEffect,
      clearWinEffect
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 