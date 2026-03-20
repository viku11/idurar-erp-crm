import { useEffect, useState } from 'react';

interface FetchResponse<T> {
  result: T;
}

interface UseFetchDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
}

interface UseFetchReturn<T> {
  result: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
}

function useFetchData<T>(fetchFunction: () => Promise<FetchResponse<T>>): UseFetchDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFunction();
        setData(data.result);
        setSuccess(true);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoading]);

  return { data, isLoading, isSuccess, error };
}

export default function useFetch<T>(fetchFunction: () => Promise<FetchResponse<T>>): UseFetchReturn<T> {
  const { data, isLoading, isSuccess, error } = useFetchData<T>(fetchFunction);

  return { result: data, isLoading, isSuccess, error };
}
