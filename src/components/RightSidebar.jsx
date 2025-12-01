import React, { useState } from 'react';
import { Bookmark, Settings, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function RightSidebar({ rssItems, onToggleReadLater, onManageFeeds }) {
  const [view, setView] = useState('all');

  const filteredItems = view === 'saved' 
    ? rssItems.filter(item => item.read_later)
    : rssItems;

  const openLink = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-80 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">RSS Feeds</h3>
          <button
            onClick={onManageFeeds}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Manage feeds"
          >
            <Settings size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('all')}
            className={`flex-1 px-3 py-2 rounded transition-colors text-sm ${
              view === 'all'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setView('saved')}
            className={`flex-1 px-3 py-2 rounded transition-colors text-sm ${
              view === 'saved'
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Saved
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {view === 'saved' ? 'No saved items' : 'No RSS items yet'}
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <button
                  onClick={() => openLink(item.link)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="font-medium text-sm mb-1 line-clamp-2 hover:text-primary dark:hover:text-primary transition-colors">
                    {item.title}
                  </div>
                </button>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openLink(item.link)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-all"
                    title="Open link"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button
                    onClick={() => onToggleReadLater(item.id, !item.read_later)}
                    className={`p-1 rounded transition-colors ${
                      item.read_later
                        ? 'text-primary'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                    title={item.read_later ? 'Remove from saved' : 'Save for later'}
                  >
                    <Bookmark size={14} fill={item.read_later ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {item.feed_title} · {item.pub_date ? formatDistanceToNow(new Date(item.pub_date), { addSuffix: true }) : 'Unknown date'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RightSidebar;
