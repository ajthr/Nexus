import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger',
  hideCancel = false,
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const buttonColor =
    type === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return (
    <Modal show={show} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {type === 'danger' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertTriangle
                className="text-red-600 dark:text-red-400"
                size={20}
              />
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300 flex-1">
            {message}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className={`flex-1 ${buttonColor} text-white px-4 py-2 rounded transition-colors`}
          >
            {confirmText}
          </button>

          {!hideCancel && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
