import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      if (window.api) {
        const savedTheme = await window.api.getTheme();
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemPrefersDark);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const cycleTheme = async () => {
    const themes = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    
    if (window.api) {
      await window.api.setTheme(nextTheme);
    }
  };

  return { theme, isDark, cycleTheme };
}
