"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  website?: string;
  walletAddress?: string;
  socialLinks?: Record<string, string>;
  isVerified: boolean;
  isActive: boolean;
}

interface ProfileCompleteness {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  totalFields: number;
}

interface AuthContextType {
  user: User | null;
  profileCompleteness: ProfileCompleteness | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  canVerify: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  checkVerificationEligibility: () => Promise<{ canVerify: boolean; missingRequired: string[]; recommendations: string[] }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profileCompleteness, setProfileCompleteness] = useState<ProfileCompleteness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canVerify, setCanVerify] = useState(false);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfileCompleteness(data.profileCompleteness);
        
        const requiredFields = ['name', 'email'];
        const missingRequired = requiredFields.filter(field => 
          !data.user[field] || data.user[field].trim() === ''
        );
        setCanVerify(missingRequired.length === 0 && data.user.isActive);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setProfileCompleteness(null);
        setCanVerify(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setProfileCompleteness(null);
      setCanVerify(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationEligibility = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { canVerify: false, missingRequired: ['login'], recommendations: [] };
      }

      const response = await fetch('/api/auth/profile-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCanVerify(data.canVerify);
        return {
          canVerify: data.canVerify,
          missingRequired: data.missingRequired,
          recommendations: data.recommendations
        };
      } else {
        return { canVerify: false, missingRequired: ['profile'], recommendations: [] };
      }
    } catch (error) {
      console.error('Verification eligibility check failed:', error);
      return { canVerify: false, missingRequired: ['error'], recommendations: [] };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        await checkAuthStatus();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfileCompleteness(null);
    setCanVerify(false);
    router.push('/');
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const authContextValue: AuthContextType = {
    user,
    profileCompleteness,
    isLoading,
    isAuthenticated: !!user,
    canVerify,
    login,
    logout,
    checkAuthStatus,
    checkVerificationEligibility
  };

  return React.createElement(
    AuthContext.Provider,
    { value: authContextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}