import * as actionTypes from './types';

interface Pagination {
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}

interface ErpItem {
  _id: string;
  [key: string]: unknown;
}

interface ListResult {
  items: ErpItem[];
  pagination: Pagination;
}

interface ListState {
  result: ListResult;
  isLoading: boolean;
  isSuccess: boolean;
}

interface CurrentState {
  result: unknown;
}

interface CrudState {
  result: unknown;
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface SearchState {
  result: unknown[];
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface ErpState {
  current: CurrentState;
  list: ListState;
  create: CrudState;
  update: CrudState;
  delete: CrudState;
  read: CrudState;
  recordPayment: CrudState;
  search: SearchState;
  summary: CrudState;
  mail: CrudState;
}

type KeyState = Exclude<keyof ErpState, 'current'>;

interface ResetStateAction {
  type: typeof actionTypes.RESET_STATE;
  payload?: unknown;
  keyState?: string;
}

interface CurrentItemAction {
  type: typeof actionTypes.CURRENT_ITEM;
  payload: unknown;
  keyState?: string;
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

interface CurrentActionAction {
  type: typeof actionTypes.CURRENT_ACTION;
  payload: unknown;
  keyState: KeyState;
}

interface ResetActionAction {
  type: typeof actionTypes.RESET_ACTION;
  payload: unknown;
  keyState: KeyState;
}

type ErpAction =
  | ResetStateAction
  | CurrentItemAction
  | RequestLoadingAction
  | RequestFailedAction
  | RequestSuccessAction
  | CurrentActionAction
  | ResetActionAction;

const INITIAL_STATE: ErpState = {
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
  recordPayment: {
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

const erpReducer = (state: ErpState = INITIAL_STATE, action: ErpAction): ErpState => {
  const { payload, keyState } = action;

  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.CURRENT_ITEM:
      return {
        ...state,
        current: {
          result: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [keyState as KeyState]: {
          ...state[keyState as KeyState],
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState as KeyState]: {
          ...state[keyState as KeyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState as KeyState]: {
          result: payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case actionTypes.CURRENT_ACTION:
      return {
        ...state,
        [keyState as KeyState]: {
          ...state[keyState as KeyState],
          current: payload,
        },
      };
    case actionTypes.RESET_ACTION:
      return {
        ...state,
        [keyState as KeyState]: {
          ...INITIAL_STATE[keyState as KeyState],
        },
      };
    default:
      return state;
  }
};

export default erpReducer;
