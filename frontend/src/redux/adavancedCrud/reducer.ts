import * as actionTypes from './types';
import type { AdvancedCrudActionType } from './types';

interface Pagination {
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}

interface ListResult {
  items: unknown[];
  pagination: Pagination;
}

interface CurrentState {
  result: unknown | null;
}

interface ListState {
  result: ListResult;
  isLoading: boolean;
  isSuccess: boolean;
}

interface CrudOperationState {
  result: unknown | null;
  current: unknown | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface SearchState {
  result: unknown[];
  current: unknown | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface AdvancedCrudState {
  current: CurrentState;
  list: ListState;
  create: CrudOperationState;
  update: CrudOperationState;
  delete: CrudOperationState;
  read: CrudOperationState;
  createInvoice: CrudOperationState;
  search: SearchState;
  summary: CrudOperationState;
  mail: CrudOperationState;
}

type KeyState = Exclude<keyof AdvancedCrudState, 'current'>;

interface ResetStateAction {
  type: typeof actionTypes.RESET_STATE;
  payload: undefined;
  keyState: undefined;
}

interface CurrentItemAction {
  type: typeof actionTypes.CURRENT_ITEM;
  payload: unknown;
  keyState: undefined;
}

interface RequestLoadingAction {
  type: typeof actionTypes.REQUEST_LOADING;
  payload: unknown;
  keyState: KeyState;
}

interface RequestFailedAction {
  type: typeof actionTypes.REQUEST_FAILED;
  payload: unknown;
  keyState: KeyState;
}

interface RequestSuccessAction {
  type: typeof actionTypes.REQUEST_SUCCESS;
  payload: unknown;
  keyState: KeyState;
}

interface CurrentAction {
  type: typeof actionTypes.CURRENT_ACTION;
  payload: unknown;
  keyState: KeyState;
}

interface ResetAction {
  type: typeof actionTypes.RESET_ACTION;
  payload: unknown;
  keyState: KeyState;
}

type AdvancedCrudAction =
  | ResetStateAction
  | CurrentItemAction
  | RequestLoadingAction
  | RequestFailedAction
  | RequestSuccessAction
  | CurrentAction
  | ResetAction;

const INITIAL_STATE: AdvancedCrudState = {
  current: {
    result: null,
  },
  list: {
    result: {
      items: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: false,
        total: 1,
      },
    },
    isLoading: false,
    isSuccess: false,
  },
  create: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  update: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  delete: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  read: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  createInvoice: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  search: {
    result: [],
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  summary: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
  mail: {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  },
};

const erpReducer = (state: AdvancedCrudState = INITIAL_STATE, action: AdvancedCrudAction): AdvancedCrudState => {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.CURRENT_ITEM:
      return {
        ...state,
        current: {
          result: action.payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [action.keyState]: {
          ...state[action.keyState],
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [action.keyState]: {
          ...state[action.keyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [action.keyState]: {
          result: action.payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case actionTypes.CURRENT_ACTION:
      return {
        ...state,
        [action.keyState]: {
          ...state[action.keyState],
          current: action.payload,
        },
      };
    case actionTypes.RESET_ACTION:
      return {
        ...state,
        [action.keyState]: {
          ...INITIAL_STATE[action.keyState],
        },
      };
    default:
      return state;
  }
};

export default erpReducer;
