import { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { Button, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
// @ts-ignore - actions.js has no type declarations
import { erp } from '@/redux/erp/actions';

import calculate from '@/utils/calculate';
// @ts-ignore - shortid has no type declarations
import { generate as uniqueId } from 'shortid';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import Loading from '@/components/Loading';

import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { settingsAction } from '@/redux/settings/actions';
// import { StatusTag } from '@/components/Tag';

interface SaveFormProps {
  form: FormInstance;
  translate: (value: string) => string;
}

function SaveForm({ form, translate }: SaveFormProps): React.JSX.Element {
  const handelClick = (): void => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('update')}
    </Button>
  );
}

interface ErpClient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ErpRecord {
  status: string;
  paymentStatus?: string;
  client: ErpClient;
  subTotal: number;
  taxTotal: number;
  taxRate: number;
  total: number;
  credit: number;
  number: number;
  year: number;
  date?: string;
  expiredDate?: string;
  items?: ErpLineItem[];
  [key: string]: unknown;
}

interface ErpLineItem {
  quantity: number;
  price: number;
  itemName: string;
  description: string;
  total?: number;
}

interface UpdateItemConfig {
  entity: string;
}

interface UpdateFormProps {
  subTotal: number;
  current: unknown;
}

interface UpdateItemProps {
  config: UpdateItemConfig;
  UpdateForm: React.ComponentType<UpdateFormProps>;
}

export default function UpdateItem({ config, UpdateForm }: UpdateItemProps): React.JSX.Element {
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState<number>(0);

  const resetErp: ErpRecord = {
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

  const [currentErp, setCurrentErp] = useState<ErpRecord>((current as ErpRecord) ?? resetErp);

  const { id } = useParams();

  const handelValuesChange = (_changedValues: Record<string, unknown>, values: Record<string, unknown>): void => {
    const items = values['items'] as ErpLineItem[] | undefined;
    let subTotal = 0;

    if (items) {
      items.map((item: ErpLineItem) => {
        if (item) {
          if (item.quantity && item.price) {
            let total = calculate.multiply(item['quantity'], item['price']);
            //sub total
            subTotal = calculate.add(subTotal, total);
          }
        }
      });
      setSubTotal(subTotal);
    }
  };

  const onSubmit = (fieldsValue: Record<string, unknown>): void => {
    let dataToUpdate: Record<string, unknown> = { ...fieldsValue };
    if (fieldsValue) {
      if (fieldsValue.date || fieldsValue.expiredDate) {
        dataToUpdate.date = dayjs(fieldsValue.date as string).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        dataToUpdate.expiredDate = dayjs(fieldsValue.expiredDate as string).format(
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        );
      }
      if (fieldsValue.items) {
        let newList: { total: number; quantity: number; price: number; itemName: string; description: string }[] = [];
        (fieldsValue.items as ErpLineItem[]).map((item: ErpLineItem) => {
          const { quantity, price, itemName, description } = item;
          const total = item.quantity * item.price;
          newList.push({ total, quantity, price, itemName, description });
        });
        dataToUpdate.items = newList;
      }
    }

    // @ts-ignore - erp.update returns a thunk
    dispatch(erp.update({ entity, id, jsonData: dataToUpdate }));
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setSubTotal(0);
      // @ts-ignore - erp.resetAction returns a thunk
      dispatch(erp.resetAction({ actionType: 'update' }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      setCurrentErp(current as ErpRecord);
      let formData: Record<string, unknown> = { ...(current as Record<string, unknown>) };
      if (formData.date) {
        formData.date = dayjs(formData.date as string);
      }
      if (formData.expiredDate) {
        formData.expiredDate = dayjs(formData.expiredDate as string);
      }
      if (!formData.taxRate) {
        formData.taxRate = 0;
      }

      const { subTotal } = formData as { subTotal: number };

      form.resetFields();
      form.setFieldsValue(formData);
      setSubTotal(subTotal);
    }
  }, [current]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={translate('update')}
        ghost={false}
        tags={[
          <span key="status">{currentErp.status && translate(currentErp.status)}</span>,
          ...(currentErp.paymentStatus ? [
            <span key="paymentStatus">
              {translate(currentErp.paymentStatus)}
            </span>,
          ] : []),
        ]}
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
          <SaveForm translate={translate} form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
          <UpdateForm subTotal={subTotal} current={current} />
        </Form>
      </Loading>
    </>
  );
}
