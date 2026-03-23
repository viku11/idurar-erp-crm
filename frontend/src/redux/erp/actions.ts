import * as actionTypes from './types';
import { request } from '@/request';

import type { Dispatch } from 'redux';
import type {
  KeyState,
  ErpAction,
  ErpItem,
} from './types';

// ---- API response shapes (derived from request module & reducer usage) ----

interface ApiPagination {
  page: string;
  count: string;
}

interface ListApiResponse {
  success: boolean;
  result: ErpItem[];
  pagination: ApiPagination;
}

interface CrudApiResponse {
  success: boolean;
  result: unknown;
}

interface RecordPaymentResult {
  invoice: unknown;
  [key: string]: unknown;
}

interface RecordPaymentApiResponse {
  success: boolean;
  result: RecordPaymentResult;
}

// ---- Parameter interfaces ----

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

interface ListOptions {
  page?: number;
  items?: number;
  [key: string]: unknown;
}

interface ListParams {
  entity: string;
  options?: ListOptions;
}

interface CreateParams {
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

// ---- Thunk action type ----
type ThunkAction = (dispatch: Dispatch<ErpAction>) => void | Promise<void>;

export const erp = {
  resetState:
    (): ThunkAction =>
    (dispatch: Dispatch<ErpAction>): void => {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }: ResetActionParams): ThunkAction =>
    (dispatch: Dispatch<ErpAction>): void => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }: CurrentItemParams): ThunkAction =>
    (dispatch: Dispatch<ErpAction>): void => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }: CurrentActionParams): ThunkAction =>
    (dispatch: Dispatch<ErpAction>): void => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }: ListParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const data: ListApiResponse = await request.list({ entity, options: options as Record<string, string> });

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
    ({ entity, jsonData }: CreateParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });

      const data: CrudApiResponse = await request.create({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'create',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
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
    ({ entity, jsonData }: CreateParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'recordPayment',
        payload: null,
      });

      const data: RecordPaymentApiResponse = await request.create({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'recordPayment',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result.invoice,
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
    ({ entity, id }: ReadParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      const data: CrudApiResponse = await request.read({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
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
    ({ entity, id, jsonData }: UpdateParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      const data: CrudApiResponse = await request.update({ entity, id, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'update',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
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
    ({ entity, id }: DeleteParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
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

      const data: CrudApiResponse = await request.delete({ entity, id });

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
    ({ entity, options }: SearchParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      const data: CrudApiResponse = await request.search({ entity, options });

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
    ({ entity, options }: SummaryParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'summary',
        payload: null,
      });

      const data: CrudApiResponse = await request.summary({ entity, options });

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
    ({ entity, jsonData }: MailParams): ThunkAction =>
    async (dispatch: Dispatch<ErpAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'mail',
        payload: null,
      });

      const data: CrudApiResponse = await request.mail({ entity, jsonData });

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
    ({ entity, id }: ConvertParams): ThunkAction =>
    async (): Promise<void> => {
      await request.convert({ entity, id });
    },
};
