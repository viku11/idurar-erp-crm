import * as actionTypes from './types';

type OpenModalAction = { type: typeof actionTypes.OPEN_MODAL };
type CloseModalAction = { type: typeof actionTypes.CLOSE_MODAL };
type OpenPanelAction = { type: typeof actionTypes.OPEN_PANEL; keyState: string };
type ClosePanelAction = { type: typeof actionTypes.CLOSE_PANEL };

type ProfileAction = OpenModalAction | CloseModalAction | OpenPanelAction | ClosePanelAction;

interface ContextActions {
  modal: {
    open: () => void;
    close: () => void;
  };
  updatePanel: {
    open: () => void;
    close: () => void;
  };
}

const contextActions = (dispatch: React.Dispatch<ProfileAction>): ContextActions => {
  return {
    modal: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_MODAL });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_MODAL });
      },
    },
    updatePanel: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_PANEL, keyState: 'update' });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
    },
  };
};

export default contextActions;
