import { useEffect } from 'react';

import { useLocation, useRoutes } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';

import routes from './routes';

interface RouteObject {
  path: string;
  element: React.ReactNode;
  children?: RouteObject[];
}

type RoutesMap = Record<string, RouteObject[]>;

export default function AppRouter(): React.ReactElement | null {
  let location = useLocation();
  const { state: stateApp, appContextAction } = useAppContext();
  const { app } = appContextAction;

  const routesList: RouteObject[] = [];

  Object.entries(routes as RoutesMap).forEach(([key, value]) => {
    routesList.push(...value);
  });

  function getAppNameByPath(path: string): string {
    const typedRoutes = routes as RoutesMap;
    for (let key in typedRoutes) {
      for (let i = 0; i < typedRoutes[key].length; i++) {
        if (typedRoutes[key][i].path === path) {
          return key;
        }
      }
    }
    // Return 'default' app  if the path is not found
    return 'default';
  }
  useEffect(() => {
    if (location.pathname === '/') {
      app.default();
    } else {
      const path = getAppNameByPath(location.pathname);
      app.open(path);
    }
  }, [location]);

  let element = useRoutes(routesList);

  return element as React.ReactElement | null;
}
