import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';
import useLanguage from '@/locale/useLanguage';
import { notification } from 'antd';

interface UpdateSettingFormConfig {
  entity: string;
  settingsCategory: string;
}

interface UpdateSettingFormProps {
  config: UpdateSettingFormConfig;
  children: React.ReactNode;
  withUpload?: boolean;
  uploadSettingKey?: string;
}

interface SettingsState {
  result: Record<string, Record<string, unknown>>;
  isLoading: boolean;
}

interface FieldsValue extends Record<string, unknown> {
  file?: Array<{ originFileObj: File }>;
}

export default function UpdateSettingForm({ config, children, withUpload, uploadSettingKey }: UpdateSettingFormProps) {
  const { entity, settingsCategory } = config;
  const dispatch = useDispatch();
  const { result, isLoading } = useSelector(selectSettings) as unknown as SettingsState;
  const translate = useLanguage();
  const [form] = Form.useForm();

  const onSubmit = (fieldsValue: FieldsValue): void => {
    console.log('\u{1F680} ~ onSubmit ~ fieldsValue:', fieldsValue);
    if (withUpload) {
      if (fieldsValue.file) {
        fieldsValue.file = fieldsValue.file[0].originFileObj as unknown as Array<{ originFileObj: File }>;
      } else {
        notification.error({
          message: translate('Please select a file to upload.'),
        });
        return;
      } 
      dispatch(
        settingsAction.upload({ entity, settingKey: uploadSettingKey!, jsonData: fieldsValue as any }) as never
      );
    } else {
      const settings: Array<{ settingKey: string; settingValue: unknown }> = [];

      for (const [key, value] of Object.entries(fieldsValue)) {
        settings.push({ settingKey: key, settingValue: value });
      }

      dispatch(settingsAction.updateMany({ entity, jsonData: { settings } }) as never);
    }
  };




  useEffect(() => {
    const current = result[settingsCategory];

    form.setFieldsValue(current);
  }, [result, settingsCategory, form]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          onFinish={onSubmit}
          // onValuesChange={handleValuesChange}
          labelCol={{ span: 10 }}
          labelAlign="left"
          wrapperCol={{ span: 16 }}
        >
          {children}
          <Form.Item
            style={{
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            <Button type="primary" htmlType="submit">
              {translate('Save')}
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
            {/* <Button onClick={() => console.log('Cancel clicked')}>{translate('Cancel')}</Button> */}
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
