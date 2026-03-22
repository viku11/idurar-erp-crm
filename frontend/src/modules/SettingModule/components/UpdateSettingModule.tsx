// import { generate as uniqueId } from 'shortid';
// import { SyncOutlined } from '@ant-design/icons';
import React from 'react';
import { Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import UpdateSettingForm from './UpdateSettingForm';

interface UpdateSettingModuleConfig {
  SETTINGS_TITLE: string;
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

interface UpdateSettingModuleProps {
  config: UpdateSettingModuleConfig;
  children: React.ReactNode;
  withUpload?: boolean;
  uploadSettingKey?: string;
}

export default function UpdateSettingModule({
  config,
  children,
  withUpload = false,
  uploadSettingKey,
}: UpdateSettingModuleProps): React.JSX.Element {
  return (
    <>
      <PageHeader
        title={config.SETTINGS_TITLE}
        ghost={false}
        // extra={[
        //   <Button key={`${uniqueId()}`} type="primary" disabled icon={<SyncOutlined />}>
        //     Update
        //   </Button>,
        // ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Divider></Divider>
      <UpdateSettingForm
        config={config}
        withUpload={withUpload}
        uploadSettingKey={uploadSettingKey}
      >
        {children}
      </UpdateSettingForm>
    </>
  );
}
