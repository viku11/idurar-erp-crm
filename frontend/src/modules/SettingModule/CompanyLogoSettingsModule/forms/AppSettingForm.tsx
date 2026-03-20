import React from 'react';
import { Button, Form, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';

import { UploadOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function AppSettingForm(): React.ReactElement {
  const translate = useLanguage();
  const beforeUpload = (file: RcFile): false => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return false;
  };
  return (
    <>
      <Form.Item
        name="file"
        label="Logo"
        valuePropName="fileList"
        getValueFromEvent={(e: { fileList: RcFile[] }) => e.fileList}
      >
        <Upload
          beforeUpload={beforeUpload}
          listType="picture"
          accept="image/png, image/jpeg"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>{translate('click_to_upload')}</Button>
        </Upload>
      </Form.Item>
    </>
  );
}
