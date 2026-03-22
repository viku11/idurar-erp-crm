import { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectUpdatedItem } from '@/redux/erp/selectors';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';

import calculate from '@/utils/calculate';
import PaymentForm from '@/forms/PaymentForm';
import { useNavigate } from 'react-router-dom';

interface InvoiceClient {
  _id: string;
  [key: string]: unknown;
}

interface CurrentInvoice {
  _id: string;
  credit: number | string;
  total: number | string;
  discount: number | string;
  amount: number | string;
  date?: string;
  client?: InvoiceClient;
  [key: string]: unknown;
}

interface UpdatePaymentConfig {
  entity: string;
}

interface UpdatePaymentProps {
  config: UpdatePaymentConfig;
  currentInvoice: CurrentInvoice;
}

export default function UpdatePayment({ config, currentInvoice }: UpdatePaymentProps): React.JSX.Element {
  const translate = useLanguage();
  const navigate = useNavigate();
  let { entity } = config;
  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState<number>(0);

  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount, amount } = currentInvoice;

      setMaxAmount(
        calculate.sub(calculate.sub(total, discount), calculate.sub(credit, amount))
      );
      const newInvoiceValues: Record<string, unknown> = { ...currentInvoice };
      if (newInvoiceValues.date) {
        newInvoiceValues.date = dayjs(newInvoiceValues.date as string);
      }
      form.setFieldsValue(newInvoiceValues);
    }
  }, [currentInvoice]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      // @ts-ignore - thunk action not compatible with default dispatch type
      dispatch(erp.resetAction({ actionType: 'recordPayment' }));
      // @ts-ignore - thunk action not compatible with default dispatch type
      dispatch(erp.list({ entity }));
      navigate(`/${entity.toLowerCase()}/read/${currentInvoice._id}`);
    }
  }, [isSuccess]);

  const onSubmit = (fieldsValue: Record<string, unknown>): void => {
    let submitData: Record<string, unknown> = { ...fieldsValue };
    if (currentInvoice) {
      const { _id: invoice } = currentInvoice;
      const client: string | undefined = currentInvoice.client && currentInvoice.client._id;
      submitData = {
        ...submitData,
        invoice,
        client,
      };
    }

    // @ts-ignore - thunk action not compatible with default dispatch type
    dispatch(erp.update({ entity, id: currentInvoice._id, jsonData: submitData }));
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <PaymentForm maxAmount={maxAmount} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {translate('Update')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
