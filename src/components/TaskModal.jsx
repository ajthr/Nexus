import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';

function TaskModal({ show, onClose, onSave, editTask = null }) {
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      // Convert ISO string to datetime-local format
      const date = new Date(editTask.scheduled_at);
      const localDateTime = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setScheduledAt(localDateTime);
    } else {
      setTitle('');
      setScheduledAt('');
    }
  }, [editTask, show]);

  const handleSave = () => {
    if (!title.trim() || !scheduledAt) {
      setValidationError('Please fill in both task title and scheduled time.');
      return;
    }

    if (editTask) {
      onSave({ id: editTask.id, title, scheduledAt });
    } else {
      onSave({ title, scheduledAt });
    }

    setTitle('');
    setScheduledAt('');
  };

  const handleClose = () => {
    setTitle('');
    setScheduledAt('');
    onClose();
  };

  // Get current date-time for min attribute
  const now = new Date();
  const currentDateTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <>
      <Modal
        show={show}
        onClose={handleClose}
        title={editTask ? 'Edit Task' : 'New Task'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={!editTask ? currentDateTime : undefined}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded transition-colors"
            >
              {editTask ? 'Update Task' : 'Add Task'}
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

export default TaskModal;
