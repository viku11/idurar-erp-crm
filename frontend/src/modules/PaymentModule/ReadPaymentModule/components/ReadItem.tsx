import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Statistic, Tag, Divider, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  MailOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';

// @ts-ignore — shortid has no bundled type declarations
import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';

import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ErpData {
  _id?: string;
  status: string;
  client: Client;
  subTotal: number;
  taxTotal: number;
  taxRate: number;
  total: number;
  credit: number;
  number: number;
  year: number;
  amount?: number;
  currency?: string;
  paymentStatus?: string;
}

interface ReadItemConfig {
  entity: string;
  ENTITY_NAME: string;
}

interface ReadItemProps {
  config: ReadItemConfig;
  selectedItem?: ErpData;
}

interface CurrentItemState {
  result: unknown;
}

export default function ReadItem({ config, selectedItem }: ReadItemProps) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();

  const { moneyFormatter } = useMoney();
  const { send, isLoading: mailInProgress } = useMail({ entity });
  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem) as CurrentItemState;

  const resetErp: ErpData = {
    status: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState<ErpData>(selectedItem ?? resetErp);
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      const { invoice, _id, ...others } = currentResult as Record<string, unknown>;
      setCurrentErp({ ...others, ...(invoice as Record<string, unknown>), _id } as ErpData);
    }
    return () => controller.abort();
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
        ghost={false}
        tags={<span>{currentErp.paymentStatus}</span>}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
          >
            {translate('Download PDF')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            loading={mailInProgress}
            onClick={() => {
              send(currentErp._id as string);
            }}
            icon={<MailOutlined />}
          >
            {translate('Send by email')}
          </Button>,

          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp as any,
                }) as any
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic title="Status" value={currentErp.status} />
          <Statistic
            title={translate('Paid')}
            value={moneyFormatter({
              amount: currentErp.amount ?? 0,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('SubTotal')}
            value={moneyFormatter({
              amount: currentErp.subTotal,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Total')}
            value={moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`${translate('Client')} : ${currentErp.client.name}`}>
        <Descriptions.Item label={translate('Address')}>{client.address}</Descriptions.Item>
        <Descriptions.Item label={translate('email')}>{client.email}</Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>{client.phone}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>{translate('Payment Information')} :</Typography.Title>
        </Col>
        <Col sm={24} md={12} style={{ textAlign: 'right' }}>
          <Button icon={<ExportOutlined />}>{translate('Show invoice')}</Button>
        </Col>
      </Row>
      <div
        style={{
          width: '300px',
          float: 'left',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>{translate('Paid')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.amount ?? 0, currency_code: currentErp.currency })}
            </p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            </p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total Paid')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.credit, currency_code: currentErp.currency })}
            </p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total Remaining')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({
                amount: currentErp.total - currentErp.credit,
                currency_code: currentErp.currency,
              })}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
