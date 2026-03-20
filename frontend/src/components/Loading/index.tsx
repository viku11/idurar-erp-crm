import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function Loading({ isLoading, children }: LoadingProps): React.JSX.Element {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 24 }}
      spin
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    />
  );

  return (
    <Spin indicator={antIcon} spinning={isLoading}>
      {children}
    </Spin>
  );
}
