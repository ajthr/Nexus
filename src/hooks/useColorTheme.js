import { useState, useEffect } from 'react';

const COLOR_THEMES = ['amethyst', 'sky', 'emerald', 'ruby', 'violet', 'lime', 'fuchsia'];
const STORAGE_KEY = 'nexus-color-theme';
const CUSTOM_COLOR_KEY = 'nexus-custom-color';

// Helper to convert hex to r g b string
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : null;
};

// Helper to adjust brightness
// percent: positive to lighten, negative to darken
const adjustColor = (r, g, b, percent) => {
  const adjust = (color) => {
    const val = Math.round(color + (255 - color) * (percent / 100));
    return Math.max(0, Math.min(255, percent > 0 ? val : Math.round(color * (1 + percent / 100))));
  };
  return `${adjust(r)} ${adjust(g)} ${adjust(b)}`;
};

export const useColorTheme = () => {
  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'amethyst';
  });

  const [customColor, setCustomColorState] = useState(() => {
    return localStorage.getItem(CUSTOM_COLOR_KEY) || '#6366f1';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem(STORAGE_KEY, colorTheme);

    if (colorTheme === 'custom' && customColor) {
      const rgb = hexToRgb(customColor);
      if (rgb) {
        const [r, g, b] = rgb.split(' ').map(Number);

        // Generate variations
        // These formulas are approximations to match the existing theme feel
        const hover = adjustColor(r, g, b, -10); // 10% darker
        const light = adjustColor(r, g, b, 85);  // 85% lighter (very pastel)
        const dark = adjustColor(r, g, b, -60);  // 60% darker

        // Set dark mode primary variables on :root to enable CSS overrides.
        document.documentElement.style.setProperty('--color-primary', rgb);
        document.documentElement.style.setProperty('--color-primary-hover', hover);
        document.documentElement.style.setProperty('--color-primary-light', light);
        document.documentElement.style.setProperty('--color-primary-dark', dark);
      }
    } else {
      // Clean up custom styles if switching back to preset
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-primary-hover');
      document.documentElement.style.removeProperty('--color-primary-light');
      document.documentElement.style.removeProperty('--color-primary-dark');
    }
  }, [colorTheme, customColor]);

  // Dynamic primary color needs dark mode logic to ensure proper contrast/shading changes.
  useEffect(() => {
    if (colorTheme === 'custom' && customColor) {
      // Need a specific, generated dark mode background color to ensure contrast
      // setting it via a separate CSS variable.
      const rgb = hexToRgb(customColor);
      if (rgb) {
        const [r, g, b] = rgb.split(' ').map(Number);
        const darkLight = adjustColor(r, g, b, -70); // Dark background for dark mode
        document.documentElement.style.setProperty('--color-primary-light-dark', darkLight);
      }
    }
  }, [colorTheme, customColor]);


  const toggleColorTheme = () => {
    setColorTheme(current => {
      if (current === 'custom') return COLOR_THEMES[0];
      const currentIndex = COLOR_THEMES.indexOf(current);
      const nextIndex = (currentIndex + 1) % COLOR_THEMES.length;
      return COLOR_THEMES[nextIndex];
    });
  };

  const setSpecificColorTheme = (theme) => {
    if (COLOR_THEMES.includes(theme) || theme === 'custom') {
      setColorTheme(theme);
    }
  };

  const setCustomColor = (hex) => {
    setCustomColorState(hex);
    localStorage.setItem(CUSTOM_COLOR_KEY, hex);
    setColorTheme('custom');
  };

  return {
    colorTheme,
    customColor,
    toggleColorTheme,
    setSpecificColorTheme,
    setCustomColor,
    availableThemes: COLOR_THEMES
  };
};

export default useColorTheme;
