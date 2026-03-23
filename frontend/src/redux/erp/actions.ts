import * as actionTypes from './types';
import type { KeyState } from './types';
import { request } from '@/request';

// ---- API response shapes (inferred from request module usage) ----

interface ApiPagination {
  page: string;
  count: string;
}

interface ApiListResponse {
  success: boolean;
  result: Record<string, unknown>[];
  pagination: ApiPagination;
}

interface ApiCrudResponse {
  success: boolean;
  result: Record<string, unknown>;
}

interface ApiRecordPaymentResponse {
  success: boolean;
  result: {
    invoice: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface ApiSearchResponse {
  success: boolean;
  result: unknown[];
}

interface ApiSummaryResponse {
  success: boolean;
  result: unknown;
}

interface ApiMailResponse {
  success: boolean;
  result: unknown;
}

// ---- Action parameter interfaces ----

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
  options?: { page: number; items: number };
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

interface ErpDispatchAction {
  type: string;
  keyState?: string;
  payload?: unknown;
}

type ThunkDispatch = (action: ErpDispatchAction) => void;

export const erp = {
  resetState:
    () =>
    (dispatch: ThunkDispatch): void => {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }: ResetActionParams) =>
    (dispatch: ThunkDispatch): void => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }: CurrentItemParams) =>
    (dispatch: ThunkDispatch): void => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }: CurrentActionParams) =>
    (dispatch: ThunkDispatch): void => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }: ListParams) =>
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const data = (await request.list({ entity, options: options as unknown as Record<string, string> })) as ApiListResponse;

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
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });

      const data = (await request.create({ entity, jsonData })) as ApiCrudResponse;

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
    ({ entity, jsonData }: RecordPaymentParams) =>
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'recordPayment',
        payload: null,
      });

      const data = (await request.create({ entity, jsonData })) as ApiRecordPaymentResponse;

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
    ({ entity, id }: ReadParams) =>
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      const data = (await request.read({ entity, id })) as ApiCrudResponse;

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
    ({ entity, id, jsonData }: UpdateParams) =>
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      const data = (await request.update({ entity, id, jsonData })) as ApiCrudResponse;

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
    ({ entity, id }: DeleteParams) =>
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'delete',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      const data = (await request.delete({ entity, id })) as ApiCrudResponse;

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
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      const data = (await request.search({ entity, options })) as ApiSearchResponse;

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
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'summary',
        payload: null,
      });

      const data = (await request.summary({ entity, options })) as ApiSummaryResponse;

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
    async (dispatch: ThunkDispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'mail',
        payload: null,
      });

      const data = (await request.mail({ entity, jsonData })) as ApiMailResponse;

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
