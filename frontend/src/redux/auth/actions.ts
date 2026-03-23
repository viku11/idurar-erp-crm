import * as actionTypes from './types';
import * as authService from '@/auth';
import { request } from '@/request';
import { Dispatch } from 'redux';

interface AuthResponseData {
  success: boolean;
  result: Record<string, unknown> | null;
  message?: string;
}

interface AuthState {
  current: Record<string, unknown> | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

interface LoginParams {
  loginData: {
    email: string;
    password: string;
  };
}

interface RegisterParams {
  registerData: {
    email: string;
    password: string;
    name: string;
  };
}

interface VerifyParams {
  userId: string;
  emailToken: string;
}

interface ResetPasswordParams {
  resetPasswordData: {
    email?: string;
    password?: string;
    token?: string;
  };
}

interface UpdateProfileParams {
  entity: string;
  jsonData: FormData;
}

interface AuthAction {
  type: string;
  payload?: Record<string, unknown> | null;
}

export const login =
  ({ loginData }: LoginParams) =>
  async (dispatch: Dispatch<AuthAction>): Promise<void> => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = (await authService.login({ loginData })) as AuthResponseData;

    if (data.success === true) {
      const auth_state: AuthState = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      window.localStorage.removeItem('isLogout');
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const register =
  ({ registerData }: RegisterParams) =>
  async (dispatch: Dispatch<AuthAction>): Promise<void> => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = (await authService.register({ registerData })) as AuthResponseData;

    if (data.success === true) {
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const verify =
  ({ userId, emailToken }: VerifyParams) =>
  async (dispatch: Dispatch<AuthAction>): Promise<void> => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = (await authService.verify({ userId, emailToken })) as AuthResponseData;

    if (data.success === true) {
      const auth_state: AuthState = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      window.localStorage.removeItem('isLogout');
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const resetPassword =
  ({ resetPasswordData }: ResetPasswordParams) =>
  async (dispatch: Dispatch<AuthAction>): Promise<void> => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = (await authService.resetPassword({ resetPasswordData })) as AuthResponseData;

    if (data.success === true) {
      const auth_state: AuthState = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      window.localStorage.removeItem('isLogout');
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const logout = () => async (dispatch: Dispatch<AuthAction>): Promise<void> => {
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
  const result = window.localStorage.getItem('auth');
  const tmpAuth = JSON.parse(result as string) as AuthState | null;
  const settings = window.localStorage.getItem('settings');
  const tmpSettings = JSON.parse(settings as string) as Record<string, unknown> | null;
  window.localStorage.removeItem('auth');
  window.localStorage.removeItem('settings');
  window.localStorage.setItem('isLogout', JSON.stringify({ isLogout: true }));
  const data = (await authService.logout()) as AuthResponseData;
  if (data.success === false) {
    const auth_state: AuthState = {
      current: tmpAuth as unknown as Record<string, unknown>,
      isLoggedIn: true,
      isLoading: false,
      isSuccess: true,
    };
    window.localStorage.setItem('auth', JSON.stringify(auth_state));
    window.localStorage.setItem('settings', JSON.stringify(tmpSettings));
    window.localStorage.removeItem('isLogout');
    dispatch({
      type: actionTypes.LOGOUT_FAILED,
      payload: data.result,
    });
  } else {
    // on logout success
  }
};

export const updateProfile =
  ({ entity, jsonData }: UpdateProfileParams) =>
  async (dispatch: Dispatch<AuthAction>): Promise<void> => {
    const data = (await request.updateAndUpload({ entity, id: '', jsonData })) as AuthResponseData;

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
      const auth_state: AuthState = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
    }
  };
