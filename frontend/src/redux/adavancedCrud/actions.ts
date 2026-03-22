import * as actionTypes from './types';
import { request } from '@/request';

// @ts-ignore - Dispatch type from redux may not be available
import type { Dispatch } from 'redux';

interface ListOptions {
  page?: number;
  items?: number;
  [key: string]: string | number | undefined;
}

interface PaginationResponse {
  page: string;
  count: string;
}

interface ApiResponse {
  success: boolean;
  result: unknown;
  pagination: PaginationResponse;
}

interface ListResultPayload {
  items: unknown;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

interface ResetActionParams {
  actionType: string;
}

interface CurrentItemParams {
  data: Record<string, unknown>;
}

interface CurrentActionParams {
  actionType: string;
  data: Record<string, unknown>;
}

interface ListParams {
  entity: string;
  options?: ListOptions;
}

interface EntityJsonDataParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface EntityIdParams {
  entity: string;
  id: string;
}

interface UpdateParams {
  entity: string;
  id: string;
  jsonData: Record<string, unknown>;
}

interface SearchOptions {
  [key: string]: string;
}

interface SearchParams {
  entity: string;
  options?: SearchOptions;
}

interface SummaryParams {
  entity: string;
  options?: Record<string, string>;
}

interface MailParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

type KeyState = 'list' | 'create' | 'createInvoice' | 'read' | 'update' | 'delete' | 'search' | 'summary' | 'mail';

interface AdvancedCrudAction {
  type: string;
  keyState?: KeyState | string;
  payload?: unknown;
}

type ThunkAction = (dispatch: Dispatch<AdvancedCrudAction>) => void | Promise<void>;

export const erp = {
  resetState: (): ThunkAction => (dispatch: Dispatch<AdvancedCrudAction>): void => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  resetAction:
    ({ actionType }: ResetActionParams): ThunkAction =>
    (dispatch: Dispatch<AdvancedCrudAction>): void => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }: CurrentItemParams): ThunkAction =>
    (dispatch: Dispatch<AdvancedCrudAction>): void => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }: CurrentActionParams): ThunkAction =>
    (dispatch: Dispatch<AdvancedCrudAction>): void => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }: ListParams): ThunkAction =>
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const data: ApiResponse = await request.list({ entity, options: options as Record<string, string> });

      if (data.success === true) {
        const result: ListResultPayload = {
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
    ({ entity, jsonData }: EntityJsonDataParams): ThunkAction =>
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });

      const data: ApiResponse = await request.create({ entity, jsonData });

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
  createInvoice:
    ({ entity, jsonData }: EntityJsonDataParams): ThunkAction =>
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'createInvoice',
        payload: null,
      });

      const data: ApiResponse = await request.create({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'createInvoice',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: (data.result as Record<string, unknown>).invoice,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'createInvoice',
          payload: null,
        });
      }
    },
  read:
    ({ entity, id }: EntityIdParams): ThunkAction =>
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      const data: ApiResponse = await request.read({ entity, id });

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
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      const data: ApiResponse = await request.update({ entity, id, jsonData });

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
    ({ entity, id }: EntityIdParams): ThunkAction =>
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'delete',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      const data: ApiResponse = await request.delete({ entity, id });

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
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      const data: ApiResponse = await request.search({ entity, options });

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
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'summary',
        payload: null,
      });

      const data: ApiResponse = await request.summary({ entity, options });

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
    async (dispatch: Dispatch<AdvancedCrudAction>): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'mail',
        payload: null,
      });

      const data: ApiResponse = await request.mail({ entity, jsonData });

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
};
