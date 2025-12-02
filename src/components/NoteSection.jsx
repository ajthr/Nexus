import React from 'react';
import { FileText, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

function NoteSection({ notes, onNoteEdit, onNoteDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText size={18} />
          Notes
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {notes.length}
        </span>
      </div>

      <div className="overflow-y-auto flex-1">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No notes yet. Click the button on the left to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map(note => (
              <div
                key={note.id}
                className="group p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">{note.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {note.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {format(new Date(note.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onNoteEdit(note)}
                      className="p-1 hover:bg-primary/20 dark:hover:bg-primary/20 text-primary dark:text-primary rounded transition-all"
                      title="Edit note"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onNoteDelete(note.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-all"
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteSection;
