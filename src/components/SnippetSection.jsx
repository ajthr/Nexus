import React from 'react';
import { Code, Trash2, Copy } from 'lucide-react';

function SnippetSection({ snippets, onSnippetDelete }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      python: 'bg-blue-100 text-primary dark:bg-blue-900 dark:text-blue-200',
      css: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      html: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      java: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      rust: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      typescript: 'bg-blue-100 text-primary dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[language?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Code size={18} />
          Snippets
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {snippets.length}
        </span>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2">
        {snippets.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No snippets yet. Click the button on the left to create one.
          </div>
        ) : (
          snippets.map(snippet => (
            <div
              key={snippet.id}
              className="group p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium mb-1">{snippet.title}</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getLanguageColor(snippet.language)}`}>
                    {snippet.language}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(snippet.content)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/20 dark:hover:bg-primary/20 text-primary dark:text-primary rounded transition-all"
                    title="Copy to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this snippet?')) {
                        onSnippetDelete(snippet.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                <code className={`language-${snippet.language}`}>
                  {snippet.content}
                </code>
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SnippetSection;
