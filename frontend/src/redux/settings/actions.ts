import * as actionTypes from './types';
import { request } from '@/request';

interface SettingData {
  settingCategory: string;
  settingKey: string;
  settingValue: unknown;
}

interface SettingsCategory {
  [category: string]: {
    [key: string]: unknown;
  };
}

interface ApiResponse {
  success: boolean;
  result: SettingData[];
}

type SettingsAction =
  | { type: typeof actionTypes.RESET_STATE }
  | { type: typeof actionTypes.REQUEST_LOADING }
  | { type: typeof actionTypes.REQUEST_FAILED }
  | { type: typeof actionTypes.UPDATE_CURRENCY; payload: Record<string, unknown> }
  | { type: typeof actionTypes.REQUEST_SUCCESS; payload: SettingsCategory };

interface UpdateCurrencyParams {
  data: Record<string, unknown>;
}

interface UpdateParams {
  entity: string;
  settingKey: string;
  jsonData: Record<string, unknown>;
}

interface UpdateManyParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface ListActionParams {
  entity: string;
}

interface UploadParams {
  entity: string;
  settingKey: string;
  jsonData: FormData;
}

const dispatchSettingsData = (datas: SettingData[]): SettingsCategory => {
  const settingsCategory: SettingsCategory = {};

  datas.map((data: SettingData) => {
    settingsCategory[data.settingCategory] = {
      ...settingsCategory[data.settingCategory],
      [data.settingKey]: data.settingValue,
    };
  });

  return settingsCategory;
};

export const settingsAction = {
  resetState: () => (dispatch: (action: SettingsAction) => void) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  updateCurrency:
    ({ data }: UpdateCurrencyParams) =>
    async (dispatch: (action: SettingsAction) => void) => {
      dispatch({
        type: actionTypes.UPDATE_CURRENCY,
        payload: data,
      });
    },
  update:
    ({ entity, settingKey, jsonData }: UpdateParams) =>
    async (dispatch: (action: SettingsAction) => void) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });
      let data: ApiResponse = await request.patch({
        entity: entity + '/updateBySettingKey/' + settingKey,
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        let data: ApiResponse = await request.listAll({ entity });

        if (data.success === true) {
          const payload: SettingsCategory = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );

          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  updateMany:
    ({ entity, jsonData }: UpdateManyParams) =>
    async (dispatch: (action: SettingsAction) => void) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });
      let data: ApiResponse = await request.patch({
        entity: entity + '/updateManySetting',
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        let data: ApiResponse = await request.listAll({ entity });

        if (data.success === true) {
          const payload: SettingsCategory = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );

          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  list:
    ({ entity }: ListActionParams) =>
    async (dispatch: (action: SettingsAction) => void) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      let data: ApiResponse = await request.listAll({ entity });

      if (data.success === true) {
        const payload: SettingsCategory = dispatchSettingsData(data.result);
        window.localStorage.setItem('settings', JSON.stringify(dispatchSettingsData(data.result)));

        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          payload,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
  upload:
    ({ entity, settingKey, jsonData }: UploadParams) =>
    async (dispatch: (action: SettingsAction) => void) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      let data: ApiResponse = await request.upload({
        entity: entity,
        id: settingKey,
        jsonData,
      });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_LOADING,
        });

        let data: ApiResponse = await request.listAll({ entity });

        if (data.success === true) {
          const payload: SettingsCategory = dispatchSettingsData(data.result);
          window.localStorage.setItem(
            'settings',
            JSON.stringify(dispatchSettingsData(data.result))
          );
          dispatch({
            type: actionTypes.REQUEST_SUCCESS,
            payload,
          });
        } else {
          dispatch({
            type: actionTypes.REQUEST_FAILED,
          });
        }
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
        });
      }
    },
};
