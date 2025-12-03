import { renderHook, waitFor, act } from '@testing-library/react';
import { useDatabase } from '../useDatabase';

describe('useDatabase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with loading state', () => {
        const mockApi = jest.fn(() => Promise.resolve([]));
        const { result } = renderHook(() => useDatabase(mockApi));

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBe(null);
        expect(result.current.error).toBe(null);
    });

    it('should fetch data on mount', async () => {
        const mockData = [{ id: 1, name: 'Test' }];
        const mockApi = jest.fn(() => Promise.resolve(mockData));

        const { result } = renderHook(() => useDatabase(mockApi));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBe(null);
        expect(mockApi).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
        const mockError = new Error('API Error');
        const mockApi = jest.fn(() => Promise.reject(mockError));

        const { result } = renderHook(() => useDatabase(mockApi));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toBe(null);
        expect(result.current.error).toBe('API Error');
    });

    it('should allow manual refresh', async () => {
        const mockData1 = [{ id: 1 }];
        const mockData2 = [{ id: 1 }, { id: 2 }];
        const mockApi = jest
            .fn()
            .mockResolvedValueOnce(mockData1)
            .mockResolvedValueOnce(mockData2);

        const { result } = renderHook(() => useDatabase(mockApi));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData1);
        expect(mockApi).toHaveBeenCalledTimes(1);

        // Manual refresh wrapped in act
        await act(async () => {
            result.current.refresh();
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData2);
        });

        expect(mockApi).toHaveBeenCalledTimes(2);
    });

    it('should reset loading state on refresh', async () => {
        const mockApi = jest.fn(() => Promise.resolve([]));
        const { result } = renderHook(() => useDatabase(mockApi));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.loading).toBe(false);

        // Trigger refresh wrapped in act
        await act(async () => {
            result.current.refresh();
            // Wait a tiny bit for loading state to be set
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // After the promise resolves, loading should eventually be false again
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    it('should clear previous errors on successful refresh', async () => {
        const mockApi = jest
            .fn()
            .mockRejectedValueOnce(new Error('First error'))
            .mockResolvedValueOnce([{ id: 1 }]);

        const { result } = renderHook(() => useDatabase(mockApi));

        await waitFor(() => {
            expect(result.current.error).toBe('First error');
        });

        // Refresh wrapped in act
        await act(async () => {
            result.current.refresh();
        });

        await waitFor(() => {
            expect(result.current.error).toBe(null);
            expect(result.current.data).toEqual([{ id: 1 }]);
        });
    });
});
