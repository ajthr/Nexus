import '@testing-library/jest-dom';

// Mock window.api globally
global.window.api = {
    getNotes: jest.fn(() => Promise.resolve([])),
    getTasks: jest.fn(() => Promise.resolve([])),
    getSnippets: jest.fn(() => Promise.resolve([])),
    getRssItems: jest.fn(() => Promise.resolve([])),
    getRssFeeds: jest.fn(() => Promise.resolve([])),
    getGridLayout: jest.fn(() => Promise.resolve([])),
    getTheme: jest.fn(() => Promise.resolve('system')),
    setTheme: jest.fn(() => Promise.resolve()),
    getColorTheme: jest.fn(() => Promise.resolve('blue')),
    setColorTheme: jest.fn(() => Promise.resolve()),
    addNote: jest.fn(() => Promise.resolve({ success: true })),
    updateNote: jest.fn(() => Promise.resolve({ success: true })),
    deleteNote: jest.fn(() => Promise.resolve({ success: true })),
    addTask: jest.fn(() => Promise.resolve({ success: true })),
    updateTask: jest.fn(() => Promise.resolve({ success: true })),
    deleteTask: jest.fn(() => Promise.resolve({ success: true })),
    addSnippet: jest.fn(() => Promise.resolve({ success: true })),
    deleteSnippet: jest.fn(() => Promise.resolve({ success: true })),
    addRssFeed: jest.fn(() => Promise.resolve({ success: true })),
    deleteRssFeed: jest.fn(() => Promise.resolve({ success: true })),
    toggleReadLater: jest.fn(() => Promise.resolve({ success: true })),
    updateGridLayout: jest.fn(() => Promise.resolve({ success: true })),
    exportData: jest.fn(() => Promise.resolve({})),
    importData: jest.fn(() => Promise.resolve({ success: true })),
    showNotification: jest.fn(),
    onRssUpdated: jest.fn(),
    onTasksUpdated: jest.fn(),
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
