import * as actionTypes from './types';

type AppContextAction =
  | { type: typeof actionTypes.OPEN_NAV_MENU }
  | { type: typeof actionTypes.CLOSE_NAV_MENU }
  | { type: typeof actionTypes.COLLAPSE_NAV_MENU }
  | { type: typeof actionTypes.CHANGE_APP; playload: string }
  | { type: typeof actionTypes.DEFAULT_APP };

interface NavMenuActions {
  open: () => void;
  close: () => void;
  collapse: () => void;
}

interface AppActions {
  open: (appName: string) => void;
  default: () => void;
}

interface ContextActions {
  navMenu: NavMenuActions;
  app: AppActions;
}

const contextActions = (dispatch: React.Dispatch<AppContextAction>): ContextActions => {
  return {
    navMenu: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_NAV_MENU });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_NAV_MENU });
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_NAV_MENU });
      },
    },
    app: {
      open: (appName: string) => {
        dispatch({ type: actionTypes.CHANGE_APP, playload: appName });
      },
      default: () => {
        dispatch({ type: actionTypes.DEFAULT_APP });
      },
    },
  };
};

export default contextActions;
