import { useEffect, ReactNode } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectCreatedItem } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

interface CrudBoxAction {
  open: () => void;
  close: () => void;
  collapse?: () => void;
}

interface CreateFormConfig {
  entity: string;
}

interface CreateFormProps {
  config: CreateFormConfig;
  formElements: ReactNode;
  withUpload?: boolean;
}

interface FieldsValue {
  file?: { originFileObj: File }[];
  [key: string]: unknown;
}

export default function CreateForm({ config, formElements, withUpload = false }: CreateFormProps): JSX.Element {
  let { entity } = config;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem) as {
    result: unknown;
    current: unknown;
    isLoading: boolean;
    isSuccess: boolean;
  };
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction as {
    panel: CrudBoxAction;
    collapsedBox: CrudBoxAction;
    readBox: CrudBoxAction;
  };
  const [form] = Form.useForm();
  const translate = useLanguage();
  const onSubmit = (fieldsValue: FieldsValue): void => {
    // Manually trim values before submission

    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj as unknown as { originFileObj: File }[];
    }

    // const trimmedValues = Object.keys(fieldsValue).reduce((acc, key) => {
    //   acc[key] = typeof fieldsValue[key] === 'string' ? fieldsValue[key].trim() : fieldsValue[key];
    //   return acc;
    // }, {});

    dispatch(crud.create({ entity, jsonData: fieldsValue, withUpload }) as unknown as Parameters<typeof dispatch>[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'create' }) as unknown as Parameters<typeof dispatch>[0]);
      dispatch(crud.list({ entity }) as unknown as Parameters<typeof dispatch>[0]);
    }
  }, [isSuccess]);

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {formElements}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('Submit')}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
