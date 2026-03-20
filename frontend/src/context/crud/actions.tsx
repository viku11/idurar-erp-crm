import * as actionTypes from './types';

interface OpenCloseActions {
  open: () => void;
  close: () => void;
}

interface OpenCloseCollapseActions extends OpenCloseActions {
  collapse: () => void;
}

interface ContextActions {
  modal: OpenCloseActions;
  advancedBox: OpenCloseActions;
  editBox: OpenCloseActions;
  panel: OpenCloseCollapseActions;
  collapsedBox: OpenCloseCollapseActions;
  readBox: OpenCloseCollapseActions;
}

type CrudActionType =
  | typeof actionTypes.OPEN_MODAL
  | typeof actionTypes.CLOSE_MODAL
  | typeof actionTypes.OPEN_ADVANCED_BOX
  | typeof actionTypes.CLOSE_ADVANCED_BOX
  | typeof actionTypes.OPEN_EDIT_BOX
  | typeof actionTypes.CLOSE_EDIT_BOX
  | typeof actionTypes.OPEN_PANEL
  | typeof actionTypes.CLOSE_PANEL
  | typeof actionTypes.COLLAPSE_PANEL
  | typeof actionTypes.OPEN_BOX
  | typeof actionTypes.CLOSE_BOX
  | typeof actionTypes.COLLAPSE_BOX
  | typeof actionTypes.OPEN_READ_BOX
  | typeof actionTypes.CLOSE_READ_BOX
  | typeof actionTypes.COLLAPSE_READ_BOX;

interface CrudAction {
  type: CrudActionType;
}

type Dispatch = (action: CrudAction) => void;

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
    advancedBox: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_ADVANCED_BOX });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_ADVANCED_BOX });
      },
    },
    editBox: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_EDIT_BOX });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_EDIT_BOX });
      },
    },
    panel: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_PANEL });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_PANEL });
      },
    },
    collapsedBox: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_BOX });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_BOX });
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_BOX });
      },
    },
    readBox: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_READ_BOX });
        console.log('readBox open');
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_READ_BOX });
        console.log('readBox close');
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_READ_BOX });
      },
    },
  };
};

export default contextActions;
