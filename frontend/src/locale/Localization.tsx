import React from 'react';
import { ConfigProvider } from 'antd';

interface LocalizationProps {
  children: React.ReactNode;
}

export default function Localization({ children }: LocalizationProps): React.JSX.Element {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#339393',
          colorLink: '#1640D6',
          borderRadius: 0,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
