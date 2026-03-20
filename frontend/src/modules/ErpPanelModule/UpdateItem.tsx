import React, { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';
import dayjs from 'dayjs';
import { Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import calculate from '@/utils/calculate';
// @ts-ignore shortid lacks type declarations
import { generate as uniqueId } from 'shortid';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import Loading from '@/components/Loading';

import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import type { FormInstance } from 'antd';

interface SaveFormProps {
  form: FormInstance;
  translate: (key: string) => string;
}

interface ErpItem {
  quantity?: number;
  price?: number;
  itemName?: string;
  description?: string;
  total?: number;
  [key: string]: unknown;
}

interface FieldsValue {
  date?: string;
  expiredDate?: string;
  items?: ErpItem[];
  [key: string]: unknown;
}

interface ErpClient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ErpState {
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
  [key: string]: unknown;
}

interface UpdatedItemState {
  current: ErpState | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface UpdateItemConfig {
  entity: string;
  [key: string]: unknown;
}

interface UpdateFormComponentProps {
  subTotal: number;
  current: ErpState | null;
}

interface UpdateItemProps {
  config: UpdateItemConfig;
  UpdateForm: React.ComponentType<UpdateFormComponentProps>;
}

function SaveForm({ form, translate }: SaveFormProps) {
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('update')}
    </Button>
  );
}

export default function UpdateItem({ config, UpdateForm }: UpdateItemProps) {
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem) as unknown as UpdatedItemState;
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);

  const resetErp: ErpState = {
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

  const [currentErp, setCurrentErp] = useState<ErpState>(current ?? resetErp);

  const { id } = useParams();

  const handelValuesChange = (_changedValues: Record<string, unknown>, values: FieldsValue) => {
    const items = values['items'];
    let subTotal = 0;

    if (items) {
      items.map((item) => {
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

  const onSubmit = (fieldsValue: FieldsValue) => {
    let dataToUpdate: FieldsValue = { ...fieldsValue };
    if (fieldsValue) {
      if (fieldsValue.date || fieldsValue.expiredDate) {
        dataToUpdate.date = dayjs(fieldsValue.date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        dataToUpdate.expiredDate = dayjs(fieldsValue.expiredDate).format(
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        );
      }
      if (fieldsValue.items) {
        let newList: ErpItem[] = [];
        fieldsValue.items.map((item) => {
          const { quantity, price, itemName, description } = item;
          const total = (item.quantity ?? 0) * (item.price ?? 0);
          newList.push({ total, quantity, price, itemName, description });
        });
        dataToUpdate.items = newList;
      }
    }

    dispatch(erp.update({ entity, id, jsonData: dataToUpdate }) as unknown as never);
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setSubTotal(0);
      dispatch(erp.resetAction({ actionType: 'update' }) as unknown as never);
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      setCurrentErp(current);
      let formData: Record<string, unknown> = { ...current };
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
          currentErp.paymentStatus && (
            <span key="paymentStatus">
              {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
            </span>
          ),
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
