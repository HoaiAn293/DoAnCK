// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AUTH_STORAGE_KEY = 'DoAnCK_auth';

// Type definitions
interface AuthUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  role?: string;
  isActive?: boolean;
  bio?: string | null;
  password?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isFirstLaunch: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: { user?: AuthUser; accessToken?: string } }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ data?: { user?: AuthUser; accessToken?: string } }>;
  signInWithGoogle: (idToken: string) => Promise<unknown>;
  signOut: () => Promise<void>;
  updateUser: (userData: AuthUser) => Promise<void>;
  markLaunched: () => void;
}

// Timeout helper for SecureStore
const secureGet = async (key: string, timeout = 2000) => {
  return Promise.race([
    SecureStore.getItemAsync(key),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeout)
    ),
  ]);
};

const secureSet = async (key: string, value: string, timeout = 2000) => {
  return Promise.race([
    SecureStore.setItemAsync(key, value),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeout)
    ),
  ]);
};

const secureDelete = async (key: string, timeout = 2000) => {
  return Promise.race([
    SecureStore.deleteItemAsync(key),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), timeout)
    ),
  ]);
};

// Create context with proper type
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

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
      console.log('Auth storage not available, starting fresh:', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveAuthState = async (userData: AuthUser, userToken: string) => {
    try {
      await secureSet(AUTH_STORAGE_KEY, JSON.stringify({ user: userData, token: userToken }));
    } catch (error) {
      console.log('Could not save auth state:', (error as Error).message);
    }
    setUser(userData);
    setToken(userToken);
    api.setToken(userToken);
  };

  const clearAuthState = async () => {
    try {
      await secureDelete(AUTH_STORAGE_KEY);
    } catch (error) {
      console.log('Could not clear auth state:', (error as Error).message);
    }
    setUser(null);
    setToken(null);
    api.clearToken();
  };

  const signIn = async (email: string, password: string) => {
    const response = await api.login(email, password);
    const userData = response.data?.user;
    const userToken = response.data?.accessToken;
    if (userData && userToken) {
      await saveAuthState(userData, userToken);
    }
    return response;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    await api.register(email, password, displayName);
    const loginResponse = await api.login(email, password);
    const userData = loginResponse.data?.user;
    const userToken = loginResponse.data?.accessToken;
    if (userData && userToken) {
      await saveAuthState(userData, userToken);
    }
    return loginResponse;
  };

  const signInWithGoogle = async (idToken: string) => {
    const mockUser: AuthUser = { name: 'Google User', email: 'user@gmail.com', role: 'customer' };
    const mockToken = 'mock_google_token';
    await saveAuthState(mockUser, mockToken);
    return { data: { user: mockUser, accessToken: mockToken } };
  };

  const signOut = async () => {
    await clearAuthState();
  };

  const updateUser = async (userData: AuthUser) => {
    setUser(userData);
    try {
      const stored = await secureGet(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        await secureSet(AUTH_STORAGE_KEY, JSON.stringify({ ...parsed, user: userData }));
      }
    } catch (error) {
      console.log('Could not update stored user:', (error as Error).message);
    }
  };

  const markLaunched = () => {
    setIsFirstLaunch(false);
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    isFirstLaunch,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUser,
    markLaunched,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;