/**
 * API Hook
 * Custom React hook for handling API operations with loading and error states
 */

import { ApiError } from "@/types/api.types";
import { useCallback, useState } from "react";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T = any>(options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError: ApiError = {
          message: err instanceof Error ? err.message : "An error occurred",
          statusCode: (err as any).statusCode,
        };
        setError(apiError);
        options?.onError?.(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
