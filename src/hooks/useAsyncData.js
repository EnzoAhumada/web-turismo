import { useState, useEffect, useCallback } from 'react';

export function useAsyncData(fetcherFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const execute = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetcherFn();
      setData(result);
    } catch (err) {
      setError(err?.message || 'No se pudo cargar la información desde la base de datos.');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, setData, loading, error, setError, reload: execute };
}
