import { useState, useCallback, useRef, useEffect } from "react";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions<T> & { interval?: number } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      const response = await fetch(url, { 
        signal: abortControllerRef.current.signal 
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      
      if (isMountedRef.current) {
        if (result.success) {
          setData(result.data);
          setError(null);
          optionsRef.current.onSuccess?.(result.data);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      const error = err instanceof Error ? err : new Error(String(err));
      if (isMountedRef.current) {
        setError(error);
        optionsRef.current.onError?.(error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [url]);

  const startPolling = useCallback(
    (interval: number = 5000) => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      fetchData();
      pollIntervalRef.current = setInterval(fetchData, interval);
    },
    [fetchData]
  );

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (optionsRef.current.autoFetch !== false) {
      fetchData();
    }
    
    return () => {
      isMountedRef.current = false;
      stopPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, stopPolling]); // fetchData depends on url, which is stable

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    startPolling,
    stopPolling,
  };
}

export function useMutation<TData, TRequest>(
  url: string,
  method: "POST" | "PATCH" | "DELETE" = "POST"
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const mutate = useCallback(
    async (payload?: TRequest, overrideUrl?: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(overrideUrl || url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: payload ? JSON.stringify(payload) : undefined,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        
        if (isMountedRef.current) {
          if (result.success) {
            setData(result.data);
            return result.data as TData;
          } else {
            throw new Error(result.error || "Unknown error");
          }
        }
        
        return result.data as TData;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw err;
        }
        
        const error = err instanceof Error ? err : new Error(String(err));
        if (isMountedRef.current) {
          setError(error);
        }
        throw error;
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [url, method]
  );
  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  return { 
    data, 
    loading, 
    error, 
    mutate,
    reset 
  };
}