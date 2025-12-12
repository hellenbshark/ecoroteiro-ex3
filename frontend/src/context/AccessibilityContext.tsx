import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  theme: 'light' | 'dark';
  fontSize: number;
  toggleTheme: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    return Number(localStorage.getItem('fontSize')) || 100;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const toggleTheme = () => { setTheme((prev) => (prev === 'light' ? 'dark' : 'light')); };
  const increaseFontSize = () => { setFontSize((prev) => Math.min(prev + 10, 150)); };
  const decreaseFontSize = () => { setFontSize((prev) => Math.max(prev - 10, 90)); };
  const resetSettings = () => { setTheme('light'); setFontSize(100); };

  return (
    <AccessibilityContext.Provider value={{ theme, fontSize, toggleTheme, increaseFontSize, decreaseFontSize, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) throw new Error('useAccessibility error');
  return context;
}