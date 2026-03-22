import * as actionTypes from './types';

interface SettingsResult {
  crm_settings: Record<string, unknown>;
  finance_settings: Record<string, unknown>;
  company_settings: Record<string, unknown>;
  app_settings: Record<string, unknown>;
  money_format_settings: Record<string, unknown>;
}

interface SettingsState {
  result: SettingsResult;
  isLoading: boolean;
  isSuccess: boolean;
}

type SettingsAction =
  | { type: typeof actionTypes.RESET_STATE }
  | { type: typeof actionTypes.REQUEST_LOADING }
  | { type: typeof actionTypes.REQUEST_FAILED }
  | { type: typeof actionTypes.UPDATE_CURRENCY; payload: Record<string, unknown> }
  | { type: typeof actionTypes.REQUEST_SUCCESS; payload: SettingsResult };

const INITIAL_SETTINGS_STATE: SettingsResult = {
  crm_settings: {},
  finance_settings: {},
  company_settings: {},
  app_settings: {},
  money_format_settings: {},
};

const INITIAL_STATE: SettingsState = {
  result: INITIAL_SETTINGS_STATE,
  isLoading: false,
  isSuccess: false,
};

const settingsReducer = (state: SettingsState = INITIAL_STATE, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
      };

    case actionTypes.UPDATE_CURRENCY:
      return {
        result: {
          ...state.result,
          money_format_settings: action.payload,
        },
        isLoading: false,
        isSuccess: true,
      };

    case actionTypes.REQUEST_SUCCESS:
      return {
        result: action.payload,
        isLoading: false,
        isSuccess: true,
      };
    default:
      return state;
  }
};

export default settingsReducer;
