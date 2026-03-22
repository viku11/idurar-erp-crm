import { useProfileContext } from '@/context/profileContext';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import { Form, Input, Modal } from 'antd';

import useLanguage from '@/locale/useLanguage';

interface PasswordFormValues {
  password: string;
  passwordCheck: string;
}

const PasswordModal: React.FC = () => {
  const translate = useLanguage();

  const { state, profileContextAction } = useProfileContext();
  const { modal } = profileContextAction;
  const { passwordModal } = state;
  const modalTitle: string = translate('Update Password');

  const [passForm] = Form.useForm<PasswordFormValues>();

  const { onFetch } = useOnFetch();

  const handelSubmit = (fieldsValue: PasswordFormValues): void => {
    const entity: string = 'admin/profile/password/';
    const updateFn = async (): Promise<{ result: unknown; success: boolean }> => {
      return await request.patch({ entity, jsonData: fieldsValue as unknown as Record<string, unknown> });
    };
    const callback: Promise<{ result: unknown; success: boolean }> = updateFn();
    onFetch(callback);
    passForm.resetFields();
    modal.close();
  };
  return (
    <Modal
      title={modalTitle}
      open={passwordModal.isOpen}
      onCancel={modal.close}
      okText="Update"
      onOk={() => {
        passForm.submit();
      }}
    >
      <Form form={passForm} layout="vertical" onFinish={handelSubmit}>
        <Form.Item
          label={translate('New Password')}
          name="password"
          rules={[
            {
              required: true,
              min: 8,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={translate('Confirm Password')}
          name="passwordCheck"
          hasFeedback
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_: unknown, value: string) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
