// Action type string literals
export const RESET_STATE: 'ERP_RESET_STATE' = 'ERP_RESET_STATE';
export const CURRENT_ITEM: 'ERP_CURRENT_ITEM' = 'ERP_CURRENT_ITEM';

export const REQUEST_LOADING: 'ERP_REQUEST_LOADING' = 'ERP_REQUEST_LOADING';
export const REQUEST_SUCCESS: 'ERP_REQUEST_SUCCESS' = 'ERP_REQUEST_SUCCESS';
export const REQUEST_FAILED: 'ERP_REQUEST_FAILED' = 'ERP_REQUEST_FAILED';

export const CURRENT_ACTION: 'ERP_CURRENT_ACTION' = 'ERP_CURRENT_ACTION';
export const RESET_ACTION: 'ERP_RESET_ACTION' = 'ERP_RESET_ACTION';

// ---- Shared ERP state interfaces ----

export interface Pagination {
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}

export interface ErpItem {
  _id: string;
  [key: string]: unknown;
}

export interface ListResult {
  items: ErpItem[];
  pagination: Pagination;
}

export interface ListState {
  result: ListResult;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface CurrentState {
  result: unknown;
}

export interface CrudState {
  result: unknown;
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface SearchState {
  result: unknown[];
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface ErpState {
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

export type KeyState = Exclude<keyof ErpState, 'current'>;

// ---- Action interfaces ----

export interface ResetStateAction {
  type: typeof RESET_STATE;
  payload?: unknown;
  keyState?: string;
}

export interface CurrentItemAction {
  type: typeof CURRENT_ITEM;
  payload: unknown;
  keyState?: string;
}

export interface RequestLoadingAction {
  type: typeof REQUEST_LOADING;
  payload: unknown;
  keyState: KeyState;
}

export interface RequestFailedAction {
  type: typeof REQUEST_FAILED;
  payload: unknown;
  keyState: KeyState;
}

export interface RequestSuccessAction {
  type: typeof REQUEST_SUCCESS;
  payload: unknown;
  keyState: KeyState;
}

export interface CurrentActionAction {
  type: typeof CURRENT_ACTION;
  payload: unknown;
  keyState: KeyState;
}

export interface ResetActionAction {
  type: typeof RESET_ACTION;
  payload: unknown;
  keyState: KeyState;
}

export type ErpAction =
  | ResetStateAction
  | CurrentItemAction
  | RequestLoadingAction
  | RequestFailedAction
  | RequestSuccessAction
  | CurrentActionAction
  | ResetActionAction;
