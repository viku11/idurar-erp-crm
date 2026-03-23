import * as actionTypes from './types';
import type { KeyState } from './types';
import { request } from '@/request';
import { Dispatch } from 'redux';

// ---- Request/response shape interfaces ----

interface ApiPaginationResponse {
  page: string;
  count: string;
}

interface ApiListResponse {
  success: boolean;
  result: unknown[];
  pagination: ApiPaginationResponse;
}

interface ApiCrudResponse {
  success: boolean;
  result: unknown;
}

interface ApiRecordPaymentResponse {
  success: boolean;
  result: {
    invoice: unknown;
    [key: string]: unknown;
  };
}

// ---- Action payload interfaces ----

interface ResetActionParams {
  actionType: KeyState;
}

interface CurrentItemParams {
  data: Record<string, unknown>;
}

interface CurrentActionParams {
  actionType: KeyState;
  data: Record<string, unknown>;
}

interface ListParams {
  entity: string;
  options?: { page?: number; items?: number; [key: string]: unknown };
}

interface CreateParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface RecordPaymentParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface ReadParams {
  entity: string;
  id: string;
}

interface UpdateParams {
  entity: string;
  id: string;
  jsonData: Record<string, unknown>;
}

interface DeleteParams {
  entity: string;
  id: string;
}

interface SearchParams {
  entity: string;
  options: Record<string, string>;
}

interface SummaryParams {
  entity: string;
  options: Record<string, string>;
}

interface MailParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface ConvertParams {
  entity: string;
  id: string;
}

// ---- Dispatch action shapes ----

interface ResetStateDispatch {
  type: typeof actionTypes.RESET_STATE;
}

interface ResetActionDispatch {
  type: typeof actionTypes.RESET_ACTION;
  keyState: KeyState;
  payload: null;
}

interface CurrentItemDispatch {
  type: typeof actionTypes.CURRENT_ITEM;
  payload: Record<string, unknown>;
}

interface CurrentActionDispatch {
  type: typeof actionTypes.CURRENT_ACTION;
  keyState: KeyState;
  payload: Record<string, unknown>;
}

interface RequestLoadingDispatch {
  type: typeof actionTypes.REQUEST_LOADING;
  keyState: KeyState;
  payload: null;
}

interface RequestSuccessDispatch {
  type: typeof actionTypes.REQUEST_SUCCESS;
  keyState: KeyState;
  payload: unknown;
}

interface RequestFailedDispatch {
  type: typeof actionTypes.REQUEST_FAILED;
  keyState: KeyState;
  payload: null;
}

type ErpDispatchAction =
  | ResetStateDispatch
  | ResetActionDispatch
  | CurrentItemDispatch
  | CurrentActionDispatch
  | RequestLoadingDispatch
  | RequestSuccessDispatch
  | RequestFailedDispatch;

export const erp = {
  resetState:
    () =>
    (dispatch: Dispatch<ErpDispatchAction>): void => {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }: ResetActionParams) =>
    (dispatch: Dispatch<ErpDispatchAction>): void => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }: CurrentItemParams) =>
    (dispatch: Dispatch<ErpDispatchAction>): void => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }: CurrentActionParams) =>
    (dispatch: Dispatch<ErpDispatchAction>): void => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }: ListParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const data: ApiListResponse = await request.list({ entity, options: options as Record<string, string> });

      if (data.success === true) {
        const result = {
          items: data.result,
          pagination: {
            current: parseInt(data.pagination.page, 10),
            pageSize: options?.items || 10,
            total: parseInt(data.pagination.count, 10),
          },
        };
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'list',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'list',
          payload: null,
        });
      }
    },
  create:
    ({ entity, jsonData }: CreateParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });

      const data: ApiCrudResponse = await request.create({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'create',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result as Record<string, unknown>,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'create',
          payload: null,
        });
      }
    },
  recordPayment:
    ({ entity, jsonData }: RecordPaymentParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'recordPayment',
        payload: null,
      });

      const data: ApiRecordPaymentResponse = await request.create({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'recordPayment',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result.invoice as Record<string, unknown>,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'recordPayment',
          payload: null,
        });
      }
    },
  read:
    ({ entity, id }: ReadParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      const data: ApiCrudResponse = await request.read({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result as Record<string, unknown>,
        });
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'read',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'read',
          payload: null,
        });
      }
    },
  update:
    ({ entity, id, jsonData }: UpdateParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      const data: ApiCrudResponse = await request.update({ entity, id, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'update',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result as Record<string, unknown>,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'update',
          payload: null,
        });
      }
    },

  delete:
    ({ entity, id }: DeleteParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'delete',
        payload: null,
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      const data: ApiCrudResponse = await request.delete({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'delete',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'delete',
          payload: null,
        });
      }
    },

  search:
    ({ entity, options }: SearchParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      const data: ApiCrudResponse = await request.search({ entity, options });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'search',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'search',
          payload: null,
        });
      }
    },

  summary:
    ({ entity, options }: SummaryParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'summary',
        payload: null,
      });

      const data: ApiCrudResponse = await request.summary({ entity, options });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'summary',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'summary',
          payload: null,
        });
      }
    },

  mail:
    ({ entity, jsonData }: MailParams) =>
    async (dispatch: Dispatch<ErpDispatchAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'mail',
        payload: null,
      });

      const data: ApiCrudResponse = await request.mail({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'mail',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'mail',
          payload: null,
        });
      }
    },

  convert:
    ({ entity, id }: ConvertParams) =>
    async (): Promise<void> => {
      await request.convert({ entity, id });
    },
};
