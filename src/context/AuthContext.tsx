import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { authService } from '../firebase/services';
import { DEMO_STUDENT_PROFILE, DEMO_ADMIN_PROFILE } from '../firebase/seedData';
import { isFirebaseConfigured } from '../firebase/config';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isFirebaseActive: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string, extra?: Partial<UserProfile>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  loginAsDemoStudent: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial load: restore profile if session exists
    authService.getCurrentProfile().then(profile => {
      setUser(profile);
      setLoading(false);
    });

    const unsubscribe = authService.onAuthStateChanged(profile => {
      setUser(profile);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const profile = await authService.login(email, password);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, extra?: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const profile = await authService.register(name, email, password, extra);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    const updated = await authService.updateProfile(user.id, data);
    setUser(updated);
    return updated;
  };

  const loginAsDemoStudent = async () => {
    setLoading(true);
    try {
      await authService.login(DEMO_STUDENT_PROFILE.email, 'password123');
      setUser(DEMO_STUDENT_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoAdmin = async () => {
    setLoading(true);
    try {
      await authService.login(DEMO_ADMIN_PROFILE.email, 'admin123');
      setUser(DEMO_ADMIN_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        isFirebaseActive: isFirebaseConfigured,
        login,
        register,
        logout,
        updateProfile,
        loginAsDemoStudent,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
