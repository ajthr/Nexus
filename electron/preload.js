const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Notes
  getNotes: () => ipcRenderer.invoke('get-notes'),
  addNote: (data) => ipcRenderer.invoke('add-note', data),
  updateNote: (data) => ipcRenderer.invoke('update-note', data),
  deleteNote: (id) => ipcRenderer.invoke('delete-note', id),
  
  // Tasks
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  addTask: (data) => ipcRenderer.invoke('add-task', data),
  updateTask: (data) => ipcRenderer.invoke('update-task', data),
  deleteTask: (id) => ipcRenderer.invoke('delete-task', id),
  
  // Snippets
  getSnippets: () => ipcRenderer.invoke('get-snippets'),
  addSnippet: (data) => ipcRenderer.invoke('add-snippet', data),
  deleteSnippet: (id) => ipcRenderer.invoke('delete-snippet', id),
  
  // RSS
  getRssFeeds: () => ipcRenderer.invoke('get-rss-feeds'),
  getRssItems: (params) => ipcRenderer.invoke('get-rss-items', params),
  addRssFeed: (url) => ipcRenderer.invoke('add-rss-feed', url),
  toggleReadLater: (data) => ipcRenderer.invoke('toggle-read-later', data),
  deleteRssFeed: (id) => ipcRenderer.invoke('delete-rss-feed', id),
  
  // Grid Layout
  getGridLayout: () => ipcRenderer.invoke('get-grid-layout'),
  updateGridLayout: (layout) => ipcRenderer.invoke('update-grid-layout', layout),
  
  // Theme
  getTheme: () => ipcRenderer.invoke('get-theme'),
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  
  // Export/Import
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (data) => ipcRenderer.invoke('import-data', data),
  
  // Notifications
  showNotification: (data) => ipcRenderer.invoke('show-notification', data),
  
  // Event listeners
  onRssUpdated: (callback) => ipcRenderer.on('rss-updated', callback),
  onTasksUpdated: (callback) => ipcRenderer.on('tasks-updated', callback),
});
