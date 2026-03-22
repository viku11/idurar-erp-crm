import * as actionTypes from './types';
import type { ErpActionType } from './types';

interface PanelState {
  isOpen: boolean;
}

type KeyState = 'create' | 'update' | 'read' | 'recordPayment' | 'deleteModal' | 'dataTableList';

export interface ErpContextState {
  create: PanelState;
  update: PanelState;
  read: PanelState;
  recordPayment: PanelState;
  deleteModal: PanelState;
  dataTableList: PanelState;
  last: string | null;
}

interface ErpAction {
  type: ErpActionType;
  keyState?: KeyState | null;
}

export const initialState: ErpContextState = {
  create: {
    isOpen: false,
  },
  update: {
    isOpen: false,
  },
  read: {
    isOpen: false,
  },
  recordPayment: {
    isOpen: false,
  },
  deleteModal: {
    isOpen: false,
  },
  dataTableList: {
    isOpen: true,
  },
  last: null,
};

export function contextReducer(state: ErpContextState, action: ErpAction): ErpContextState {
  const { keyState = null } = action;
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        deleteModal: { isOpen: true },
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        deleteModal: { isOpen: false },
      };
    case actionTypes.OPEN_PANEL:
      return {
        ...initialState,
        dataTableList: {
          isOpen: false,
        },
        ...(keyState ? { [keyState]: { isOpen: true } } : {}),
      };
    case actionTypes.CLOSE_PANEL:
      return {
        ...initialState,
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
