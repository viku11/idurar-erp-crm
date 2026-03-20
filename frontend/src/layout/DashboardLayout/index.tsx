import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return (
    <div
      style={{
        marginLeft: 140,
      }}
    >
      {children}
    </div>
  );
}
