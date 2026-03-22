import * as actionTypes from './types';

interface AuthState {
  current: Record<string, unknown> | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

interface RequestLoadingAction {
  type: typeof actionTypes.REQUEST_LOADING;
}

interface RequestFailedAction {
  type: typeof actionTypes.REQUEST_FAILED;
}

interface RequestSuccessAction {
  type: typeof actionTypes.REQUEST_SUCCESS;
  payload: Record<string, unknown>;
}

interface RegisterSuccessAction {
  type: typeof actionTypes.REGISTER_SUCCESS;
}

interface LogoutSuccessAction {
  type: typeof actionTypes.LOGOUT_SUCCESS;
}

interface LogoutFailedAction {
  type: typeof actionTypes.LOGOUT_FAILED;
  payload: Record<string, unknown>;
}

type AuthAction =
  | RequestLoadingAction
  | RequestFailedAction
  | RequestSuccessAction
  | RegisterSuccessAction
  | LogoutSuccessAction
  | LogoutFailedAction;

const INITIAL_STATE: AuthState = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const authReducer = (state: AuthState = INITIAL_STATE, action: AuthAction): AuthState => {
  switch (action.type) {
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        isLoggedIn: false,
        isLoading: true,
      };
    case actionTypes.REQUEST_FAILED:
      return INITIAL_STATE;

    case actionTypes.REQUEST_SUCCESS:
      return {
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };

    case actionTypes.REGISTER_SUCCESS:
      return {
        current: null,
        isLoggedIn: false,
        isLoading: false,
        isSuccess: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    case actionTypes.LOGOUT_FAILED:
      return {
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };

    default:
      return state;
  }
};

export default authReducer;
