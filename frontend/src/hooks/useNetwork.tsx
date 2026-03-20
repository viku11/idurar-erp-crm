import { useEffect, useState } from 'react';
import { isObject } from '@/utils/valueType';

enum NetworkEventType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CHANGE = 'change',
}

interface NetworkInformation extends EventTarget {
  rtt?: number;
  type?: string;
  saveData?: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface ConnectionProperty {
  rtt?: number;
  type?: string;
  saveData?: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
}

interface NetworkState extends ConnectionProperty {
  since: Date | undefined;
  online: boolean | undefined;
}

function getConnection(): NetworkInformation | null {
  const nav = navigator as NavigatorWithConnection;
  if (!isObject(nav)) return null;
  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
}

function getConnectionProperty(): ConnectionProperty {
  const c = getConnection();
  if (!c) return {};
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType,
  };
}

function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    return {
      since: undefined,
      online: navigator?.onLine,
      ...getConnectionProperty(),
    };
  });

  useEffect(() => {
    const onOnline = (): void => {
      setState((prevState) => ({ ...prevState, online: true, since: new Date() }));
    };
    const onOffline = (): void => {
      setState((prevState) => ({ ...prevState, online: false, since: new Date() }));
    };
    const onConnectionChange = (): void => {
      setState((prevState) => ({ ...prevState, ...getConnectionProperty() }));
    };

    window.addEventListener(NetworkEventType.ONLINE, onOnline);
    window.addEventListener(NetworkEventType.OFFLINE, onOffline);

    const connection = getConnection();
    connection?.addEventListener(NetworkEventType.CHANGE, onConnectionChange);

    return () => {
      window.removeEventListener(NetworkEventType.ONLINE, onOnline);
      window.removeEventListener(NetworkEventType.OFFLINE, onOffline);
      connection?.removeEventListener(NetworkEventType.CHANGE, onConnectionChange);
    };
  }, []);

  return state;
}

export default useNetwork;
