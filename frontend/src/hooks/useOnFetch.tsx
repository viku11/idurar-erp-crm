import { useState } from 'react';

interface FetchResponse<T = unknown> {
  result: T;
  success: boolean;
}

interface UseOnFetchReturn<T = unknown> {
  onFetch: (callback: Promise<FetchResponse<T>>) => Promise<void>;
  result: T | null;
  isSuccess: boolean;
  isLoading: boolean;
}

export default function useOnFetch<T = unknown>(): UseOnFetchReturn<T> {
  const [result, setResult] = useState<T | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFetch = async (callback: Promise<FetchResponse<T>>): Promise<void> => {
    setIsLoading(true);

    const data = await callback;
    setResult(data.result);
    if (data.success === true) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
    setIsLoading(false);
  };

  return { onFetch, result, isSuccess, isLoading };
}
