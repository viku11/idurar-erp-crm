import React from 'react';
import { Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

const PageLoader: React.FC = () => {
  // @ts-expect-error: @ant-design/icons types require onPointerEnterCapture/onPointerLeaveCapture (React 18 compat issue)
  const antIcon: React.ReactNode = <LoadingOutlined style={{ fontSize: 64 }} spin />;
  return (
    <div className="centerAbsolute">
      <Spin indicator={antIcon}></Spin>
    </div>
  );
};
export default PageLoader;
