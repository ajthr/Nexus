import React, { useState } from 'react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';

function SnippetModal({ show, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [validationError, setValidationError] = useState(null);

  const languages = [
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'csharp',
    'go',
    'rust',
    'php',
    'ruby',
    'html',
    'css',
    'sql',
    'bash',
    'json',
    'yaml',
  ];

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setValidationError('Please fill in both title and code content.');
      return;
    }

    onSave({ title, content, language });
    setTitle('');
    setContent('');
    setLanguage('javascript');
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setLanguage('javascript');
    onClose();
  };

  return (
    <>
      <Modal show={show} onClose={handleClose} title="New Snippet">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Snippet Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter snippet title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your code here..."
              rows="12"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              spellCheck="false"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Save Snippet
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
        title="Missing information"
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

export default SnippetModal;
