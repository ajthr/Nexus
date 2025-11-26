import React from 'react';
import { FileText, CheckSquare, Code } from 'lucide-react';

function LeftSidebar({ onNewNote, onNewTask, onNewSnippet }) {
  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-16 flex flex-col items-center gap-3 py-4">
      <button
        onClick={onNewNote}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
        title="New Note"
      >
        <FileText size={20} />
      </button>
      
      <button
        onClick={onNewTask}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
        title="New Task"
      >
        <CheckSquare size={20} />
      </button>
      
      <button
        onClick={onNewSnippet}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
        title="New Snippet"
      >
        <Code size={20} />
      </button>
    </div>
  );
}

export default LeftSidebar;
