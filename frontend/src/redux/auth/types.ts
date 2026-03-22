export const FAILED_REQUEST = 'AUTH_FAILED_REQUEST' as const;
export const LOADING_REQUEST = 'AUTH_LOADING_REQUEST' as const;

export const LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS' as const;
export const REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS' as const;

export const LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS' as const;
export const LOGOUT_FAILED = 'AUTH_LOGOUT_FAILED' as const;

export const RESET_STATE = 'AUTH_RESET_STATE' as const;

export const REQUEST_LOADING = 'AUTH_REQUEST_LOADING' as const;
export const REQUEST_SUCCESS = 'AUTH_REQUEST_SUCCESS' as const;
export const REQUEST_FAILED = 'AUTH_REQUEST_FAILED' as const;

export type AuthActionType =
  | typeof FAILED_REQUEST
  | typeof LOADING_REQUEST
  | typeof LOGIN_SUCCESS
  | typeof REGISTER_SUCCESS
  | typeof LOGOUT_SUCCESS
  | typeof LOGOUT_FAILED
  | typeof RESET_STATE
  | typeof REQUEST_LOADING
  | typeof REQUEST_SUCCESS
  | typeof REQUEST_FAILED;
