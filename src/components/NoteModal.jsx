import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { Bold, Italic, List } from 'lucide-react';

function NoteModal({ show, onClose, onSave, editNote = null }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editNote, show]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setValidationError('Please fill in both title and content.');
      return;
    }

    if (editNote) {
      onSave({ id: editNote.id, title, content });
    } else {
      onSave({ title, content });
    }

    setTitle('');
    setContent('');
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <>
      <Modal
        show={show}
        onClose={handleClose}
        title={editNote ? 'Edit Note' : 'New Note'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <div className="mb-2 flex gap-1">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Bold (not implemented in textarea)"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Italic (not implemented in textarea)"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="List (not implemented in textarea)"
              >
                <List size={16} />
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content..."
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded transition-colors"
            >
              {editNote ? 'Update Note' : 'Save Note'}
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

export default NoteModal;
