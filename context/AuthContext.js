import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'DoAnCK_auth';

// Timeout helper for SecureStore
const secureGet = async (key, timeout = 2000) => {
  return Promise.race([
    SecureStore.getItemAsync(key),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeout)
    ),
  ]);
};

const secureSet = async (key, value, timeout = 2000) => {
  return Promise.race([
    SecureStore.setItemAsync(key, value),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeout)
    ),
  ]);
};

const secureDelete = async (key, timeout = 2000) => {
  return Promise.race([
    SecureStore.deleteItemAsync(key),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeout)
    ),
  ]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const stored = await secureGet(AUTH_STORAGE_KEY);
      if (stored) {
        const { user: storedUser, token: storedToken } = JSON.parse(stored);
        setUser(storedUser);
        setToken(storedToken);
        api.setToken(storedToken);
      }
    } catch (error) {
      console.log('Auth storage not available, starting fresh:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAuthState = async (userData, userToken) => {
    try {
      await secureSet(AUTH_STORAGE_KEY, JSON.stringify({ user: userData, token: userToken }));
    } catch (error) {
      console.log('Could not save auth state:', error.message);
    }
    // Luôn cập nhật state dù save có thất bại
    setUser(userData);
    setToken(userToken);
    api.setToken(userToken);
  };

  const clearAuthState = async () => {
    try {
      await secureDelete(AUTH_STORAGE_KEY);
    } catch (error) {
      console.log('Could not clear auth state:', error.message);
    }
    setUser(null);
    setToken(null);
    api.clearToken();
  };

  const signIn = async (email, password) => {
    const response = await api.login(email, password);
    await saveAuthState(response.user, response.token);
    return response;
  };

  const signUp = async (email, password, displayName) => {
    const response = await api.register(email, password, displayName);
    await saveAuthState(response.user, response.token);
    return response;
  };

  const signInWithGoogle = async (idToken) => {
    const response = await api.googleAuth(idToken);
    await saveAuthState(response.user, response.token);
    return response;
  };

  const signOut = async () => {
    await clearAuthState();
  };

  const updateUser = async (userData) => {
    setUser(userData);
    try {
      const stored = await secureGet(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        await secureSet(
          AUTH_STORAGE_KEY,
          JSON.stringify({ ...parsed, user: userData })
        );
      }
    } catch (error) {
      console.log('Could not update stored user:', error.message);
    }
  };

  const markLaunched = () => {
    setIsFirstLaunch(false);
  };

  const value = {
    user,
    token,
    loading,
    isFirstLaunch,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUser,
    markLaunched,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
