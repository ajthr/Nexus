import React from 'react';
import { CheckSquare, Calendar, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

function TaskSection({ tasks, onTaskToggle, onTaskEdit, onTaskDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-semibold flex items-center gap-2">
          <CheckSquare size={18} />
          Tasks
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {tasks.filter(t => !t.completed).length}/{tasks.length}
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No tasks yet. Click the button on the left to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className="group p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onTaskToggle(task.id, e.target.checked)}
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {format(new Date(task.scheduled_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onTaskEdit(task)}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded transition-all"
                      title="Edit task"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onTaskDelete(task.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-all"
                      title="Delete task"
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

export default TaskSection;
