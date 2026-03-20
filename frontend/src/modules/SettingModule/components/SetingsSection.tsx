import React from 'react';
import { Col, Divider, Row, Typography } from 'antd';

const { Title, Text } = Typography;

interface SetingsSectionProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
}

export default function SetingsSection({ title, description, children }: SetingsSectionProps) {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Title level={4}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </Col>

      <Col
        xl={{ span: 18, offset: 2 }}
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
        {children}
      </Col>
      <Divider />
    </Row>
  );
}
