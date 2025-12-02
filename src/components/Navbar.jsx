import React from "react";
import { Rss, Download, Upload, Sun, Moon, Monitor } from "lucide-react";

function Navbar({
  theme,
  onThemeChange,
  colorTheme,
  toggleColorTheme,
  onRssClick,
  onExport,
  onImport,
}) {
  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={18} />;
      case "dark":
        return <Moon size={18} />;
      default:
        return <Monitor size={18} />;
    }
  };

  const getColorThemeIcon = () => {
    const size = 16;

    const themeColorMap = {
      'amethyst': '166 149 255', // default
      'sky': '14 165 233',
      'emerald': '16 185 129',
      'ruby': '220 38 38',
      'violet': '139 92 246',
      'lime': '101 163 13',
      'fuchsia': '217 70 239',
    };

    const defaultColorRgb = '166 149 255';

    // Determine the color string. Fall back to the default if the theme is not found.
    const colorRgbString = themeColorMap[colorTheme] ? themeColorMap[colorTheme] : defaultColorRgb;
    const color = `rgb(${colorRgbString})`;

    return <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
    </svg>;
  };

  const getThemeLabel = () => {
    return colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <h1 className="logo font-semibold text-primary tracking-wide">Nexus</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={onThemeChange}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          title={`Current: ${theme}`}
        >
          {getThemeIcon()}
        </button>

        <button
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          onClick={toggleColorTheme}
          title={`Color Theme: ${getThemeLabel()}`}
          aria-label={`Switch color theme. Current: ${getThemeLabel()}`}
        >
          <span className="theme-icon">{getColorThemeIcon()}</span>
        </button>

        <button
          onClick={onRssClick}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          title="Add RSS Feed"
        >
          <Rss size={18} />
        </button>

        <button
          onClick={onExport}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          title="Export Data"
        >
          <Download size={18} />
        </button>

        <button
          onClick={onImport}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          title="Import Data"
        >
          <Upload size={18} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
