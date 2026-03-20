import React from 'react';

import { CrudContextProvider } from '@/context/crud';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps): React.JSX.Element {
  return <CrudContextProvider>{children}</CrudContextProvider>;
}

export default DefaultLayout;
