import React, { useState } from 'react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';

function RssFeedModal({ show, onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleAdd = async () => {
    if (!url.trim()) {
      setValidationError('Please enter a valid RSS feed URL.');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setValidationError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    await onAdd(url);
    setLoading(false);
    setUrl('');
  };

  const handleClose = () => {
    setUrl('');
    onClose();
  };

  return (
    <>
      <Modal show={show} onClose={handleClose} title="Add RSS Feed">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">RSS Feed URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the URL of an RSS or Atom feed
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Feed'}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        show={!!validationError}
        title="Invalid URL"
        message={validationError || ''}
        type="info"
        confirmText="OK"
        hideCancel
        onConfirm={() => setValidationError(null)}
        onClose={() => setValidationError(null)}
      />
    </>
  );
}

export default RssFeedModal;
