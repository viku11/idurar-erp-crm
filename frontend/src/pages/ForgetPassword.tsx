import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Form, Result, Button } from 'antd';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';

import ForgetPasswordForm from '@/forms/ForgetPasswordForm';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

interface ForgetPasswordFormValues {
  email: string;
}

const ForgetPassword: React.FC = () => {
  const translate = useLanguage();

  const navigate = useNavigate();

  const { onFetch, isSuccess, isLoading } = useOnFetch();

  async function postData(data: ForgetPasswordFormValues) {
    return await request.post({ entity: 'forgetpassword', jsonData: data as unknown as Record<string, unknown> });
  }

  const onFinish = (values: ForgetPasswordFormValues): void => {
    const callback = postData(values);
    onFetch(callback);
  };

  const FormContainer: React.FC = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          name="signup"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <ForgetPasswordForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size="large">
              {translate('Request new Password')}
            </Button>
            {translate('Or')} <a href="/login"> {translate('already have account Login')} </a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };
  if (!isSuccess) {
    return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Forget Password" />;
  } else {
    return (
      <Result
        status="success"
        title={translate('Check your email address to reset your password')}
        subTitle={translate('Password Reset in progress')}
        style={{ maxWidth: '450px', margin: 'auto' }}
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(`/login`);
            }}
          >
            {translate('Login')}
          </Button>
        }
      ></Result>
    );
  }
};

export default ForgetPassword;
