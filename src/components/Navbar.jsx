import React from 'react';
import { Rss, Download, Upload, Sun, Moon, Monitor } from 'lucide-react';

function Navbar({ theme, onThemeChange, onRssClick, onExport, onImport }) {
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      default:
        return <Monitor size={18} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">Nexus</h1>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onThemeChange}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          title={`Current: ${theme}`}
        >
          {getThemeIcon()}
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
