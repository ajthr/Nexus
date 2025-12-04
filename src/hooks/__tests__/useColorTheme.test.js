import { renderHook, act } from '@testing-library/react';
import { useColorTheme } from '../useColorTheme';

describe('useColorTheme', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Clear document attributes
        document.documentElement.removeAttribute('data-color-theme');
    });

    it('should initialize with default amethyst theme', () => {
        const { result } = renderHook(() => useColorTheme());

        expect(result.current.colorTheme).toBe('amethyst');
    });

    it('should load saved theme from localStorage', () => {
        localStorage.setItem('nexus-color-theme', 'sky');

        const { result } = renderHook(() => useColorTheme());

        expect(result.current.colorTheme).toBe('sky');
    });

    it('should set data attribute on document element', () => {
        renderHook(() => useColorTheme());

        expect(document.documentElement.getAttribute('data-color-theme')).toBe('amethyst');
    });

    it('should save theme to localStorage', () => {
        renderHook(() => useColorTheme());

        expect(localStorage.getItem('nexus-color-theme')).toBe('amethyst');
    });

    it('should toggle through all color themes', () => {
        const { result } = renderHook(() => useColorTheme());
        const expectedThemes = ['amethyst', 'sky', 'emerald', 'ruby', 'violet', 'lime', 'fuchsia'];

        expectedThemes.forEach((theme, index) => {
            expect(result.current.colorTheme).toBe(theme);

            if (index < expectedThemes.length - 1) {
                act(() => {
                    result.current.toggleColorTheme();
                });
            }
        });

        // Should cycle back to first
        act(() => {
            result.current.toggleColorTheme();
        });

        expect(result.current.colorTheme).toBe('amethyst');
    });

    it('should set specific color theme', () => {
        const { result } = renderHook(() => useColorTheme());

        act(() => {
            result.current.setSpecificColorTheme('ruby');
        });

        expect(result.current.colorTheme).toBe('ruby');
        expect(localStorage.getItem('nexus-color-theme')).toBe('ruby');
    });

    it('should ignore invalid color theme', () => {
        const { result } = renderHook(() => useColorTheme());

        act(() => {
            result.current.setSpecificColorTheme('invalid');
        });

        expect(result.current.colorTheme).toBe('amethyst');
    });

    it('should provide available themes list', () => {
        const { result } = renderHook(() => useColorTheme());

        expect(result.current.availableThemes).toEqual([
            'amethyst', 'sky', 'emerald', 'ruby', 'violet', 'lime', 'fuchsia'
        ]);
    });

    it('should update document attribute when theme changes', () => {
        const { result } = renderHook(() => useColorTheme());

        act(() => {
            result.current.toggleColorTheme();
        });

        expect(document.documentElement.getAttribute('data-color-theme')).toBe('sky');
    });
});
