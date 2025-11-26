import React, { useState } from 'react';
import Modal from './Modal';
import { Trash2 } from 'lucide-react';

function RssManageModal({ show, onClose, feeds, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (feedId) => {
    setDeletingId(feedId);
    await onDelete(feedId);
    setDeletingId(null);
  };

  return (
    <Modal show={show} onClose={onClose} title="Manage RSS Feeds">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {feeds && feeds.length > 0 ? (
          feeds.map(feed => (
            <div
              key={feed.id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{feed.title || 'Untitled Feed'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{feed.url}</div>
                </div>
                <button
                  onClick={() => handleDelete(feed.id)}
                  disabled={deletingId === feed.id}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors disabled:opacity-50"
                  title="Delete feed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No RSS feeds added yet
          </div>
        )}
      </div>
    </Modal>
  );
}

export default RssManageModal;
