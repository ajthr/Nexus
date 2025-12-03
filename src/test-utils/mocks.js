// Mock data for tests

export const mockNotes = [
    {
        id: 1,
        title: 'Test Note 1',
        content: 'This is test note content 1',
        created_at: '2024-01-15T10:30:00Z',
    },
    {
        id: 2,
        title: 'Test Note 2',
        content: 'This is test note content 2',
        created_at: '2024-01-16T14:20:00Z',
    },
];

export const mockTasks = [
    {
        id: 1,
        title: 'Test Task 1',
        scheduled_at: '2024-01-20T09:00:00Z',
        completed: false,
    },
    {
        id: 2,
        title: 'Test Task 2',
        scheduled_at: '2024-01-21T15:30:00Z',
        completed: true,
    },
];

export const mockSnippets = [
    {
        id: 1,
        title: 'Test Snippet 1',
        content: 'console.log("Hello World");',
        language: 'javascript',
    },
    {
        id: 2,
        title: 'Test Snippet 2',
        content: 'print("Hello Python")',
        language: 'python',
    },
];

export const mockRssItems = [
    {
        id: 1,
        title: 'RSS Item 1',
        link: 'https://example.com/item1',
        pubDate: '2024-01-15T10:00:00Z',
        read_later: false,
        feed_id: 1,
    },
    {
        id: 2,
        title: 'RSS Item 2',
        link: 'https://example.com/item2',
        pubDate: '2024-01-16T11:00:00Z',
        read_later: true,
        feed_id: 1,
    },
];

export const mockRssFeeds = [
    {
        id: 1,
        url: 'https://example.com/feed.xml',
        title: 'Example Feed',
    },
];

export const mockGridLayout = [
    { i: 'notes', x: 0, y: 0, w: 4, h: 2 },
    { i: 'tasks', x: 4, y: 0, w: 4, h: 2 },
    { i: 'snippets', x: 8, y: 0, w: 4, h: 2 },
    { i: 'timer', x: 0, y: 2, w: 4, h: 2 },
];

// Factory functions for creating test data
export const createMockNote = (overrides = {}) => ({
    id: Math.random(),
    title: 'Mock Note',
    content: 'Mock content',
    created_at: new Date().toISOString(),
    ...overrides,
});

export const createMockTask = (overrides = {}) => ({
    id: Math.random(),
    title: 'Mock Task',
    scheduled_at: new Date().toISOString(),
    completed: false,
    ...overrides,
});

export const createMockSnippet = (overrides = {}) => ({
    id: Math.random(),
    title: 'Mock Snippet',
    content: 'Mock code',
    language: 'javascript',
    ...overrides,
});

// Reset all mocks helper
export const resetApiMocks = () => {
    Object.values(window.api).forEach(mock => {
        if (typeof mock === 'function' && mock.mockClear) {
            mock.mockClear();
        }
    });
};
