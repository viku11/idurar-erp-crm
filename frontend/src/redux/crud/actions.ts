import * as actionTypes from './types';
import { request } from '@/request';

// @ts-ignore — request module returns untyped response.data
type RequestResponse = {
  success: boolean;
  result: unknown;
  pagination?: {
    page: string;
    count: string;
  };
  message?: string;
};

type Dispatch = (action: CrudAction) => void;

type CrudAction =
  | { type: typeof actionTypes.RESET_STATE }
  | { type: typeof actionTypes.RESET_ACTION; keyState: string; payload?: null }
  | { type: typeof actionTypes.CURRENT_ITEM; payload: Record<string, unknown> }
  | { type: typeof actionTypes.CURRENT_ACTION; keyState: string; payload: Record<string, unknown> }
  | { type: typeof actionTypes.REQUEST_LOADING; keyState: string; payload: null }
  | { type: typeof actionTypes.REQUEST_SUCCESS; keyState: string; payload: unknown }
  | { type: typeof actionTypes.REQUEST_FAILED; keyState: string; payload: null };

interface ListOptions {
  page?: number;
  items?: number;
  [key: string]: unknown;
}

interface SearchOptions {
  [key: string]: string;
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

interface CreateParams {
  entity: string;
  jsonData: Record<string, unknown> | FormData;
  withUpload?: boolean;
}

interface ReadParams {
  entity: string;
  id: string;
}

interface UpdateParams {
  entity: string;
  id: string;
  jsonData: Record<string, unknown> | FormData;
  withUpload?: boolean;
}

interface DeleteParams {
  entity: string;
  id: string;
}

interface SearchParams {
  entity: string;
  options?: SearchOptions;
}

export const crud = {
  resetState:
    (_props: Record<string, unknown> = {}) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }: ResetActionParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }: CurrentItemParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }: CurrentActionParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }: ListParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const data: RequestResponse = await request.list({ entity, options: options as Record<string, string> });

      if (data.success === true) {
        const result = {
          items: data.result,
          pagination: {
            current: parseInt(data.pagination!.page, 10),
            pageSize: options?.items,
            total: parseInt(data.pagination!.count, 10),
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
    ({ entity, jsonData, withUpload = false }: CreateParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });
      let data: RequestResponse;
      if (withUpload) {
        data = await request.createAndUpload({ entity, jsonData: jsonData as FormData });
      } else {
        data = await request.create({ entity, jsonData: jsonData as Record<string, unknown> });
      }

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
  read:
    ({ entity, id }: ReadParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      const data: RequestResponse = await request.read({ entity, id });

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
    ({ entity, id, jsonData, withUpload = false }: UpdateParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      let data: RequestResponse;

      if (withUpload) {
        data = await request.updateAndUpload({ entity, id, jsonData: jsonData as FormData });
      } else {
        data = await request.update({ entity, id, jsonData: jsonData as Record<string, unknown> });
      }

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
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'delete',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      const data: RequestResponse = await request.delete({ entity, id });

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
    ({ entity, options = {} }: SearchParams) =>
    async (dispatch: Dispatch): Promise<void> => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      const data: RequestResponse = await request.search({ entity, options });

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
};
