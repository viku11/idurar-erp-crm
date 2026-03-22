import * as actionTypes from './types';

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
}

interface KeyState {
  result: unknown;
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface ListState {
  result: {
    items: unknown[];
    pagination: Pagination;
  };
  isLoading: boolean;
  isSuccess: boolean;
}

interface CurrentState {
  result: unknown;
}

interface SearchState {
  result: unknown[];
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface CrudState {
  current: CurrentState;
  list: ListState;
  create: KeyState;
  update: KeyState;
  delete: KeyState;
  read: KeyState;
  search: SearchState;
}

type DynamicKeyState = 'list' | 'create' | 'update' | 'delete' | 'read' | 'search';

interface ResetStateAction {
  type: typeof actionTypes.RESET_STATE;
  payload?: unknown;
  keyState?: DynamicKeyState;
}

interface CurrentItemAction {
  type: typeof actionTypes.CURRENT_ITEM;
  payload: unknown;
  keyState?: DynamicKeyState;
}

interface RequestLoadingAction {
  type: typeof actionTypes.REQUEST_LOADING;
  payload: unknown;
  keyState: DynamicKeyState;
}

interface RequestFailedAction {
  type: typeof actionTypes.REQUEST_FAILED;
  payload: unknown;
  keyState: DynamicKeyState;
}

interface RequestSuccessAction {
  type: typeof actionTypes.REQUEST_SUCCESS;
  payload: unknown;
  keyState: DynamicKeyState;
}

interface CurrentActionAction {
  type: typeof actionTypes.CURRENT_ACTION;
  payload: unknown;
  keyState: DynamicKeyState;
}

interface ResetActionAction {
  type: typeof actionTypes.RESET_ACTION;
  payload: unknown;
  keyState: DynamicKeyState;
}

type CrudAction =
  | ResetStateAction
  | CurrentItemAction
  | RequestLoadingAction
  | RequestFailedAction
  | RequestSuccessAction
  | CurrentActionAction
  | ResetActionAction;

const INITIAL_KEY_STATE: KeyState = {
  result: null,
  current: null,
  isLoading: false,
  isSuccess: false,
};

const INITIAL_STATE: CrudState = {
  current: {
    result: null,
  },
  list: {
    result: {
      items: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1,
        showSizeChanger: false,
      },
    },
    isLoading: false,
    isSuccess: false,
  },
  create: INITIAL_KEY_STATE,
  update: INITIAL_KEY_STATE,
  delete: INITIAL_KEY_STATE,
  read: INITIAL_KEY_STATE,
  search: { ...INITIAL_KEY_STATE, result: [] },
};

const crudReducer = (state: CrudState = INITIAL_STATE, action: CrudAction): CrudState => {
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
        [keyState as DynamicKeyState]: {
          ...state[keyState as DynamicKeyState],
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState as DynamicKeyState]: {
          ...state[keyState as DynamicKeyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState as DynamicKeyState]: {
          result: payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case actionTypes.CURRENT_ACTION:
      return {
        ...state,
        [keyState as DynamicKeyState]: {
          ...INITIAL_KEY_STATE,
          current: payload,
        },
      };
    case actionTypes.RESET_ACTION:
      return {
        ...state,
        [keyState as DynamicKeyState]: {
          ...INITIAL_STATE[keyState as DynamicKeyState],
        },
      };
    default:
      return state;
  }
};

export default crudReducer;
