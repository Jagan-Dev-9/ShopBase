"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after component mounts (client-side only)
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      // Fallback for environments without localStorage
      console.warn('localStorage not available, using default theme');
    }
  }, []);

  // Save theme to localStorage when it changes (only on client)
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        // Add data attribute to document for CSS theming
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } catch (error) {
        console.warn('Could not save theme to localStorage');
      }
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Always provide the same structure to avoid hydration mismatch
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
