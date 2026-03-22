import { useState, useEffect } from 'react';
import { Form, Button } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectRecordPaymentItem } from '@/redux/erp/selectors';
import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';

import PaymentForm from '@/forms/PaymentForm';
import { useNavigate } from 'react-router-dom';
import calculate from '@/utils/calculate';

interface RecordPaymentConfig {
  entity: string;
}

interface RecordPaymentProps {
  config: RecordPaymentConfig;
}

interface InvoiceClient {
  _id: string;
}

interface CurrentInvoice {
  _id: string;
  credit: number;
  total: number;
  discount: number;
  client?: InvoiceClient;
}

interface RecordPaymentState {
  isLoading: boolean;
  isSuccess: boolean;
  current: unknown;
}

interface PaymentFieldsValue {
  [key: string]: unknown;
  invoice?: string;
  client?: string;
}

export default function RecordPayment({ config }: RecordPaymentProps) {
  const navigate = useNavigate();
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();

  const { isLoading, isSuccess, current: currentInvoice } = useSelector(selectRecordPaymentItem) as RecordPaymentState;

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState<number>(0);
  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount } = currentInvoice as CurrentInvoice;
      setMaxAmount(calculate.sub(calculate.sub(total, discount), credit));
    }
  }, [currentInvoice]);
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      // @ts-ignore - erp actions are thunks from untyped JS module
      dispatch(erp.resetAction({ actionType: 'recordPayment' }));
      // @ts-ignore - erp actions are thunks from untyped JS module
      dispatch(erp.list({ entity }));
      navigate(`/${entity}/`);
    }
  }, [isSuccess]);

  const onSubmit = (fieldsValue: PaymentFieldsValue) => {
    if (currentInvoice) {
      const typedInvoice = currentInvoice as CurrentInvoice;
      const { _id: invoice } = typedInvoice;
      const client: string | undefined = typedInvoice.client && typedInvoice.client._id;
      fieldsValue = {
        ...fieldsValue,
        invoice,
        client,
      };
    }

    const recordPaymentAction = erp.recordPayment({
      entity: 'payment',
      jsonData: fieldsValue,
    });
    // @ts-ignore - erp actions are thunks from untyped JS module
    dispatch(recordPaymentAction);
  };

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <PaymentForm maxAmount={maxAmount} />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('Record Payment')}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
