import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button } from 'antd';
import store from '@/redux/store';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
// @ts-ignore
import LoginForm from '@/forms/LoginForm';
// @ts-ignore
import Loading from '@/components/Loading';
// @ts-ignore
import AuthModule from '@/modules/AuthModule';

interface AuthState {
  current: Record<string, unknown> | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

interface RootState {
  auth: AuthState;
  [key: string]: unknown;
}

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector<RootState, AuthState>(selectAuth);
  const navigate = useNavigate();
  // const size = useSize();

  const dispatch: AppDispatch = store.dispatch;
  const onFinish = (values: LoginFormValues): void => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer: React.FC = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
            email:'admin@admin.com',
            password:'admin123',
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
              size="large"
            >
              {translate('Log in')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />;
};

export default LoginPage;
