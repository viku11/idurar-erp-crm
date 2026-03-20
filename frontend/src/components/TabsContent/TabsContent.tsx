import React from 'react';
import { Tabs, Row, Col } from 'antd';
import type { TabNavListProps } from 'rc-tabs/lib/TabNavList';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <Col className="gutter-row" order={0}>
      <div className="whiteBox shadow" style={{ minHeight: '480px' }}>
        <div className="pad40">{children}</div>
      </div>
    </Col>
  );
};

interface TopCardProps {
  pageTitle: string;
}

const TopCard: React.FC<TopCardProps> = ({ pageTitle }) => {
  return (
    <div
      className="whiteBox shadow"
      style={{
        color: '#595959',
        fontSize: 13,
        height: '70px',
        minHeight: 'auto',
        marginBottom: '24px',
      }}
    >
      <div className="pad20 strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#22075e', marginBottom: 0, marginTop: 0 }}>{pageTitle}</h2>
      </div>
    </div>
  );
};

interface RightMenuProps {
  children: React.ReactNode;
  pageTitle: string;
}

const RightMenu: React.FC<RightMenuProps> = ({ children, pageTitle }) => {
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 24 }}
      md={{ span: 7 }}
      lg={{ span: 6 }}
      order={1}
    >
      <TopCard pageTitle={pageTitle} />
      <div className="whiteBox shadow">
        <div className="pad25" style={{ width: '100%', paddingBottom: 0 }}>
          {children}
        </div>
      </div>
    </Col>
  );
};

interface ContentItem {
  key?: string;
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface TabsContentProps {
  content: ContentItem[];
  defaultActiveKey: string;
  pageTitle: string;
}

export default function TabsContent({ content, defaultActiveKey, pageTitle }: TabsContentProps): React.ReactElement {
  const items = content.map((item: ContentItem, index: number) => {
    return {
      key: item.key ? item.key : index + '_' + item.label.replace(/ /g, '_'),
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {item.icon} <span style={{ paddingRight: 30 }}>{item.label}</span>
        </div>
      ),
      children: <SettingsLayout>{item.children}</SettingsLayout>,
    };
  });

  const renderTabBar = (props: TabNavListProps, DefaultTabBar: React.ComponentType<TabNavListProps>): React.ReactElement => (
    <RightMenu pageTitle={pageTitle}>
      <DefaultTabBar {...props} />
    </RightMenu>
  );

  return (
    <Row gutter={[24, 24]} className="tabContent">
      <Tabs
        tabPosition="right"
        defaultActiveKey={defaultActiveKey}
        hideAdd={true}
        items={items}
        renderTabBar={renderTabBar}
      />
    </Row>
  );
}
