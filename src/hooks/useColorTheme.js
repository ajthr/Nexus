import { useState, useEffect } from 'react';

const COLOR_THEMES = ['blue', 'tomato', 'orange', 'lightblue'];
const STORAGE_KEY = 'nexus-color-theme';

export const useColorTheme = () => {
  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'blue';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem(STORAGE_KEY, colorTheme);
  }, [colorTheme]);

  const toggleColorTheme = () => {
    setColorTheme(current => {
      const currentIndex = COLOR_THEMES.indexOf(current);
      const nextIndex = (currentIndex + 1) % COLOR_THEMES.length;
      return COLOR_THEMES[nextIndex];
    });
  };

  const setSpecificColorTheme = (theme) => {
    if (COLOR_THEMES.includes(theme)) {
      setColorTheme(theme);
    }
  };

  return {
    colorTheme,
    toggleColorTheme,
    setSpecificColorTheme,
    availableThemes: COLOR_THEMES
  };
};

export default useColorTheme;
