import * as actionTypes from './types';

export interface AppState {
  isNavMenuClose: boolean;
  currentApp: string;
}

interface OpenNavMenuAction {
  type: typeof actionTypes.OPEN_NAV_MENU;
}

interface CloseNavMenuAction {
  type: typeof actionTypes.CLOSE_NAV_MENU;
}

interface CollapseNavMenuAction {
  type: typeof actionTypes.COLLAPSE_NAV_MENU;
}

interface ChangeAppAction {
  type: typeof actionTypes.CHANGE_APP;
  playload: string;
}

interface DefaultAppAction {
  type: typeof actionTypes.DEFAULT_APP;
}

export type AppAction =
  | OpenNavMenuAction
  | CloseNavMenuAction
  | CollapseNavMenuAction
  | ChangeAppAction
  | DefaultAppAction;

export const initialState: AppState = {
  isNavMenuClose: false,
  currentApp: 'default',
};

export function contextReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case actionTypes.OPEN_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: false,
      };
    case actionTypes.CLOSE_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: true,
      };
    case actionTypes.COLLAPSE_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: !state.isNavMenuClose,
      };
    case actionTypes.CHANGE_APP:
      return {
        ...state,
        currentApp: action.playload,
      };
    case actionTypes.DEFAULT_APP:
      return {
        ...state,
        currentApp: 'default',
      };

    default: {
      throw new Error(`Unhandled action type: ${(action as { type: string }).type}`);
    }
  }
}
