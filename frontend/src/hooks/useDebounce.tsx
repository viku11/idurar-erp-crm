import { useEffect, DependencyList } from 'react';
import useTimeoutFn from './useTimeoutFn';

export default function useDebounce(
  fn: () => void,
  ms: number = 0,
  deps: DependencyList = []
): [() => boolean | null, () => void] {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reset, deps);

  return [isReady, cancel];
}
