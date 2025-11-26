import { useState, useEffect, useCallback, useRef } from 'react';

export function useDatabase(apiMethod, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Always keep the latest apiMethod in a ref
  const apiRef = useRef(apiMethod);
  useEffect(() => {
    apiRef.current = apiMethod;
  }, [apiMethod]);

  // Stable refresh function (doesn't change between renders)
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiRef.current();
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err ?? 'Unknown error');
      setError(message);
      console.error('Database error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on mount and whenever dependencies change
  useEffect(() => {
    refresh();
    // We intentionally don't include `refresh` here to keep this from
    // re-running just because `refresh` is a stable callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refresh };
}
