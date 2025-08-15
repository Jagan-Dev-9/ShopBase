"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      } else {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    }
  }, [accessToken, mounted]);

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/api/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        if (res.status === 401) {
          // Token is invalid, clear it
          setAccessToken(null);
        }
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access);
        await fetchUserProfile(data.access);
        return { success: true };
      } else {
        const errorData = await res.json();
        return { 
          success: false, 
          error: errorData.detail || "Invalid credentials" 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: "Network error. Please try again." 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch("http://localhost:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const errorData = await res.json();
        return { 
          success: false, 
          error: errorData 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: { general: "Network error. Please try again." }
      };
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  const updateUserProfile = async (userData) => {
    try {
      const res = await fetch("http://localhost:8000/api/accounts/me/", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      return { 
        success: false, 
        error: { general: "Network error. Please try again." }
      };
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    register,
    updateUserProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
