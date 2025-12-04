import React, { useRef, useState, useEffect } from "react";
import { Rss, Download, Upload, Sun, Moon, Monitor, Palette, ChevronDown } from "lucide-react";

function Navbar({
  theme,
  onThemeChange,
  colorTheme,
  customColor,
  setCustomColor,
  availableThemes,
  setSpecificColorTheme,
  onRssClick,
  onExport,
  onImport,
}) {
  const colorInputRef = useRef(null);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowColorMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const themeColorMap = {
    'amethyst': '166 149 255', // default
    'sky': '14 165 233',
    'emerald': '16 185 129',
    'ruby': '220 38 38',
    'violet': '139 92 246',
    'lime': '101 163 13',
    'fuchsia': '217 70 239',
  };

  const getColorThemeIcon = () => {
    const size = 16;

    if (colorTheme === 'custom' && customColor) {
      return <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill={customColor} />
      </svg>;
    }

    const defaultColorRgb = '166 149 255';
    const colorRgbString = themeColorMap[colorTheme] ? themeColorMap[colorTheme] : defaultColorRgb;
    const color = `rgb(${colorRgbString})`;

    return <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
    </svg>;
  };

  const handleColorChange = (e) => {
    setCustomColor(e.target.value);
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

        {/* Unified Color Menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors flex items-center gap-1"
            onClick={() => setShowColorMenu(!showColorMenu)}
            title="Color Theme"
          >
            <span className="theme-icon">{getColorThemeIcon()}</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {showColorMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                Presets
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {availableThemes.map((t) => {
                  const rgb = themeColorMap[t];
                  const color = `rgb(${rgb})`;
                  const isActive = colorTheme === t;

                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setSpecificColorTheme(t);
                        setShowColorMenu(false);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${isActive ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-800' : ''}`}
                      style={{ backgroundColor: color }}
                      title={t.charAt(0).toUpperCase() + t.slice(1)}
                      aria-label={`Select ${t} theme`}
                    />
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700 pt-2">
                Custom
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <button
                    onClick={() => colorInputRef.current?.click()}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm ${colorTheme === 'custom' ? 'ring-2 ring-primary ring-inset' : ''}`}
                  >
                    <Palette size={16} />
                    <span>Pick Color</span>
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={customColor || '#6366f1'}
                    onChange={handleColorChange}
                    className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

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
