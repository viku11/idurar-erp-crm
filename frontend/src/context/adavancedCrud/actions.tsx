import * as actionTypes from './types';

type KeyState = 'read' | 'update' | 'create' | 'recordPayment';

interface ModalAction {
  type: typeof actionTypes.OPEN_MODAL | typeof actionTypes.CLOSE_MODAL;
}

interface PanelAction {
  type: typeof actionTypes.OPEN_PANEL | typeof actionTypes.CLOSE_PANEL;
  keyState?: KeyState;
}

type AdvancedCrudAction = ModalAction | PanelAction;

type Dispatch = (action: AdvancedCrudAction) => void;

interface PanelControls {
  open: () => void;
  close: () => void;
}

interface ContextActions {
  modal: PanelControls;
  readPanel: PanelControls;
  updatePanel: PanelControls;
  createPanel: PanelControls;
  recordPanel: PanelControls;
}

const contextActions = (dispatch: Dispatch): ContextActions => {
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
