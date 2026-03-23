import React from 'react';
import Profile from './components/Profile';
import ProfileLayout from '@/layout/ProfileLayout';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

interface ProfileModuleConfig {
  ENTITY_NAME: string;
}

interface ProfileModuleProps {
  config: ProfileModuleConfig;
}

export default function ProfileModule({ config }: ProfileModuleProps): React.JSX.Element {
  return (
    <ProfileLayout>
      <Layout className="site-layout">
        <Content
          className="whiteBox shadow"
          style={{
            padding: '50px 40px',
            margin: '100px auto',
            width: '100%',
            maxWidth: '1100px',
          }}
        >
          <Profile config={config} />
        </Content>
      </Layout>
    </ProfileLayout>
  );
}
