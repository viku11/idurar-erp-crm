import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';
// @ts-ignore — shortid has no bundled type declarations
import { generate as uniqueId } from 'shortid';
import { useMoney } from '@/settings';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import UpdatePayment from './UpdatePayment';
// @ts-ignore — tagColor import may lack type declarations
import { tagColor } from '@/utils/statusTagColor';

interface PaymentClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: unknown;
}

interface CurrentItemInvoice {
  _id: string;
  [key: string]: unknown;
}

interface CurrentItem {
  _id: string;
  invoice?: CurrentItemInvoice;
  [key: string]: unknown;
}

interface CurrentErpData {
  _id: string;
  number: string | number;
  year: string | number;
  paymentStatus: string;
  subTotal: number;
  total: number;
  discount: number;
  credit: number;
  currency: string;
  amount: number;
  client: PaymentClient;
  [key: string]: unknown;
}

interface PaymentConfig {
  entity: string;
  ENTITY_NAME: string;
}

interface PaymentProps {
  config: PaymentConfig;
  currentItem: CurrentItem;
}

export default function Payment({ config, currentItem }: PaymentProps): React.JSX.Element {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;

  const money = useMoney();
  const navigate = useNavigate();

  const [currentErp, setCurrentErp] = useState<CurrentErpData>({} as CurrentErpData);

  useEffect(() => {
    const controller = new AbortController();
    if (currentItem) {
      const { invoice, _id, ...others } = currentItem;
      setCurrentErp({ ...others, ...invoice, _id } as CurrentErpData);
    }
    return () => controller.abort();
  }, [currentItem]);

  const [client, setClient] = useState<PaymentClient>({} as PaymentClient);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 20, push: 2 }}
        >
          <PageHeader
            onBack={() => navigate(`/${entity.toLowerCase()}`)}
            title={`Update  ${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
            ghost={false}
            tags={<span>{currentErp.paymentStatus}</span>}
            // subTitle="This is cuurent erp page"
            extra={[
              <Button
                key={`${uniqueId()}`}
                onClick={() => {
                  navigate(`/${entity.toLowerCase()}`);
                }}
                icon={<CloseCircleOutlined />}
              >
                {translate('Cancel')}
              </Button>,
              <Button
                key={`${uniqueId()}`}
                onClick={() => navigate(`/invoice/read/${currentErp._id}`)}
                icon={<FileTextOutlined />}
              >
                {translate('Show invoice')}
              </Button>,
            ]}
            style={{
              padding: '20px 0px',
            }}
          ></PageHeader>
          <Divider dashed />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 10, order: 2, push: 2 }}
          lg={{ span: 10, order: 2, push: 4 }}
        >
          <div className="space50"></div>
          <Descriptions title={`${translate('Client')} : ${currentErp.client.name}`} column={1}>
            <Descriptions.Item label={translate('email')}>{client.email}</Descriptions.Item>
            <Descriptions.Item label={translate('Phone')}>{client.phone}</Descriptions.Item>
            <Divider dashed />
            <Descriptions.Item label={translate('Payment Status')}>
              <span>{currentErp.paymentStatus}</span>
            </Descriptions.Item>
            <Descriptions.Item label={translate('SubTotal')}>
              {money.moneyFormatter({
                amount: currentErp.subTotal,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Total')}>
              {money.moneyFormatter({
                amount: currentErp.total,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Discount">
              {money.moneyFormatter({
                amount: currentErp.discount,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Balance">
              {money.moneyFormatter({
                amount: currentErp.credit,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col
          className="gutter-row"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 1 }}
          lg={{ span: 10, order: 1, push: 2 }}
        >
          <UpdatePayment config={config} currentInvoice={currentErp} />
        </Col>
      </Row>
    </>
  );
}
