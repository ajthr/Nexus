import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.api.getTheme.mockResolvedValue('system');
    });

    it('should initialize with system theme', async () => {
        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('system');

        // Wait for the theme to load
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });

    it('should load theme from API on mount', async () => {
        window.api.getTheme.mockResolvedValue('dark');

        const { result } = renderHook(() => useTheme());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(window.api.getTheme).toHaveBeenCalled();
        expect(result.current.theme).toBe('dark');
    });

    it('should set isDark to true when theme is dark', async () => {
        window.api.getTheme.mockResolvedValue('dark');

        const { result } = renderHook(() => useTheme());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.isDark).toBe(true);
    });

    it('should set isDark to false when theme is light', async () => {
        window.api.getTheme.mockResolvedValue('light');

        const { result } = renderHook(() => useTheme());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.isDark).toBe(false);
    });

    it('should cycle through themes correctly', async () => {
        window.api.getTheme.mockResolvedValue('system');
        window.api.setTheme.mockResolvedValue();

        const { result } = renderHook(() => useTheme());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.theme).toBe('system');

        // Cycle to light
        await act(async () => {
            await result.current.cycleTheme();
        });

        expect(result.current.theme).toBe('light');
        expect(window.api.setTheme).toHaveBeenCalledWith('light');

        // Cycle to dark
        await act(async () => {
            await result.current.cycleTheme();
        });

        expect(result.current.theme).toBe('dark');
        expect(window.api.setTheme).toHaveBeenCalledWith('dark');

        // Cycle back to system
        await act(async () => {
            await result.current.cycleTheme();
        });

        expect(result.current.theme).toBe('system');
        expect(window.api.setTheme).toHaveBeenCalledWith('system');
    });

    it('should respect system preference when theme is system', async () => {
        window.api.getTheme.mockResolvedValue('system');

        // Mock system prefers dark
        window.matchMedia = jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }));

        const { result } = renderHook(() => useTheme());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.isDark).toBe(true);
    });
});
