"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

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
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  checkVerificationEligibility: () => Promise<{
    canVerify: boolean;
    missingRequired: string[];
    recommendations: string[];
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profileCompleteness, setProfileCompleteness] =
    useState<ProfileCompleteness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canVerify, setCanVerify] = useState(false);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const refreshToken = localStorage.getItem("refreshToken");

      // First, try to use cached user data if available
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setCanVerify(true); // Assume can verify if we have cached data
        } catch (error) {
          console.error("Error parsing cached user data:", error);
          localStorage.removeItem("user");
        }
      }

      if (!token) {
        // Try to refresh token if we have refresh token
        if (refreshToken) {
          await refreshAccessToken();
        }
        setIsLoading(false);
        return;
      }

      // Then verify with server
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data.user);
          setProfileCompleteness(data.data.profileCompleteness);

          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(data.data.user));

          const requiredFields = ["name", "email"];
          const missingRequired = requiredFields.filter(
            (field) =>
              !data.data.user[field] || data.data.user[field].trim() === ""
          );
          setCanVerify(missingRequired.length === 0);
        }
      } else if (response.status === 401 && refreshToken) {
        // Token expired, try to refresh
        await refreshAccessToken();
      } else {
        // Token invalid, clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setProfileCompleteness(null);
        setCanVerify(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setProfileCompleteness(null);
      setCanVerify(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return false;
      }

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          setUser(data.data.user);
          setCanVerify(true);
          return true;
        }
      } else {
        // Refresh token invalid, clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setProfileCompleteness(null);
        setCanVerify(false);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setProfileCompleteness(null);
      setCanVerify(false);
    }
    return false;
  };

  const checkVerificationEligibility = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          canVerify: false,
          missingRequired: ["login"],
          recommendations: [],
        };
      }

      const response = await fetch("/api/auth/profile-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCanVerify(data.canVerify);
        return {
          canVerify: data.canVerify,
          missingRequired: data.missingRequired,
          recommendations: data.recommendations,
        };
      } else {
        return {
          canVerify: false,
          missingRequired: ["profile"],
          recommendations: [],
        };
      }
    } catch (error) {
      console.error("Verification eligibility check failed:", error);
      return {
        canVerify: false,
        missingRequired: ["error"],
        recommendations: [],
      };
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Save refresh token if rememberMe is true
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        setUser(data.data.user);
        setCanVerify(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Network error occurred" };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setProfileCompleteness(null);
      setCanVerify(false);
      router.push("/login");
    }
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
    checkVerificationEligibility,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
