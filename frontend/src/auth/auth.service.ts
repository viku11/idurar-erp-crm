import { API_BASE_URL } from '@/config/serverApiConfig';

import axios from 'axios';
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';

interface RequestError {
  response?: {
    status: number;
    data?: {
      message?: string;
      jwtExpired?: boolean;
      error?: {
        name?: string;
      };
    };
    error?: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface ResetPasswordData {
  email?: string;
  password?: string;
  token?: string;
}

interface AuthResponseData {
  success: boolean;
  result: Record<string, unknown> | null;
  message?: string;
}

interface LoginParams {
  loginData: LoginData;
}

interface RegisterParams {
  registerData: RegisterData;
}

interface VerifyParams {
  userId: string;
  emailToken: string;
}

interface ResetPasswordParams {
  resetPasswordData: ResetPasswordData;
}

export const login = async ({ loginData }: LoginParams): Promise<AuthResponseData | ReturnType<typeof errorHandler>> => {
  try {
    const response = await axios.post(
      API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
      loginData
    );

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error as RequestError);
  }
};

export const register = async ({ registerData }: RegisterParams): Promise<AuthResponseData | ReturnType<typeof errorHandler>> => {
  try {
    const response = await axios.post(API_BASE_URL + `register`, registerData);

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error as RequestError);
  }
};

export const verify = async ({ userId, emailToken }: VerifyParams): Promise<AuthResponseData | ReturnType<typeof errorHandler>> => {
  try {
    const response = await axios.get(API_BASE_URL + `verify/${userId}/${emailToken}`);

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error as RequestError);
  }
};

export const resetPassword = async ({ resetPasswordData }: ResetPasswordParams): Promise<AuthResponseData | ReturnType<typeof errorHandler>> => {
  try {
    const response = await axios.post(API_BASE_URL + `resetpassword`, resetPasswordData);

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error as RequestError);
  }
};
export const logout = async (): Promise<AuthResponseData | ReturnType<typeof errorHandler>> => {
  axios.defaults.withCredentials = true;
  try {
    // window.localStorage.clear();
    const response = await axios.post(API_BASE_URL + `logout?timestamp=${new Date().getTime()}`);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error as RequestError);
  }
};

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
