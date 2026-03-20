import * as actionTypes from './types';

type KeyState = 'read' | 'update' | 'create' | 'recordPayment';

type ErpAction =
  | { type: typeof actionTypes.OPEN_MODAL }
  | { type: typeof actionTypes.CLOSE_MODAL }
  | { type: typeof actionTypes.OPEN_PANEL; keyState: KeyState }
  | { type: typeof actionTypes.CLOSE_PANEL };

interface PanelActions {
  open: () => void;
  close: () => void;
}

interface ContextActions {
  modal: PanelActions;
  readPanel: PanelActions;
  updatePanel: PanelActions;
  createPanel: PanelActions;
  recordPanel: PanelActions;
}

const contextActions = (dispatch: React.Dispatch<ErpAction>): ContextActions => {
  return {
    modal: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_MODAL });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_MODAL });
      },
    },
    readPanel: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_PANEL, keyState: 'read' });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
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
    createPanel: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_PANEL, keyState: 'create' });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
    },
    recordPanel: {
      open: () => {
        dispatch({
          type: actionTypes.OPEN_PANEL,
          keyState: 'recordPayment',
        });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
    },
  };
};

export default contextActions;
