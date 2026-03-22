export const RESET_STATE = 'ADVANCED_CRUD_RESET_STATE' as const;
export const CURRENT_ITEM = 'ADVANCED_CRUD_CURRENT_ITEM' as const;

export const REQUEST_LOADING = 'ADVANCED_CRUD_REQUEST_LOADING' as const;
export const REQUEST_SUCCESS = 'ADVANCED_CRUD_REQUEST_SUCCESS' as const;
export const REQUEST_FAILED = 'ADVANCED_CRUD_REQUEST_FAILED' as const;

export const CURRENT_ACTION = 'ADVANCED_CRUD_CURRENT_ACTION' as const;
export const RESET_ACTION = 'ADVANCED_CRUD_RESET_ACTION' as const;

export type AdvancedCrudActionType =
  | typeof RESET_STATE
  | typeof CURRENT_ITEM
  | typeof REQUEST_LOADING
  | typeof REQUEST_SUCCESS
  | typeof REQUEST_FAILED
  | typeof CURRENT_ACTION
  | typeof RESET_ACTION;
