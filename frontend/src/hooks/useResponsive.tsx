import { useEffect, useState } from 'react';
import isBrowser from '@/utils/isBrowser';

interface ResponsiveConfig {
  [key: string]: number;
}

interface ResponsiveInfo {
  [key: string]: boolean;
}

interface UseResponsiveReturn {
  screenSize: ResponsiveInfo;
  isMobile: boolean;
}

const subscribers = new Set<() => void>();
let info: ResponsiveInfo = {};
let responsiveConfig: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  isMobile: 768,
  md: 768,
  lg: 992,
  xl: 1200,
};
function handleResize(): void {
  const oldInfo = info;
  calculate();
  if (oldInfo === info) return;
  for (const subscriber of subscribers) {
    subscriber();
  }
}
let listening = false;
function calculate(): void {
  const width = window.innerWidth;
  const newInfo: ResponsiveInfo = {};
  let shouldUpdate = false;
  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key];
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    info = newInfo;
  }
}
export function configResponsive(config: ResponsiveConfig): void {
  responsiveConfig = config;
  if (info) calculate();
}
export default function useResponsive(): UseResponsiveReturn {
  if (isBrowser && !listening) {
    info = {};
    calculate();
    window.addEventListener('resize', handleResize);
    listening = true;
  }
  const [state, setState] = useState<ResponsiveInfo>(info);
  useEffect(() => {
    if (!isBrowser) return;
    // In React 18's StrictMode, useEffect perform twice, resize listener is remove, so handleResize is never perform.
    // https://github.com/alibaba/hooks/issues/1910
    if (!listening) {
      window.addEventListener('resize', handleResize);
    }
    const subscriber = (): void => {
      setState(info);
    };
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        window.removeEventListener('resize', handleResize);
        listening = false;
      }
    };
  }, []);
  return { screenSize: state, isMobile: !state.md };
}
