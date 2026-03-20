import * as actionTypes from './types';

interface PanelState {
  isOpen: boolean;
}

export interface AdvancedCrudState {
  create: PanelState;
  update: PanelState;
  read: PanelState;
  recordPayment: PanelState;
  deleteModal: PanelState;
  dataTableList: PanelState;
  last: null;
  [key: string]: PanelState | null;
}

type AdvancedCrudActionType =
  | { type: typeof actionTypes.OPEN_MODAL; keyState?: string }
  | { type: typeof actionTypes.CLOSE_MODAL; keyState?: string }
  | { type: typeof actionTypes.OPEN_PANEL; keyState: string }
  | { type: typeof actionTypes.CLOSE_PANEL; keyState?: string };

export const initialState: AdvancedCrudState = {
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

export function contextReducer(state: AdvancedCrudState, action: AdvancedCrudActionType): AdvancedCrudState {
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
    case actionTypes.OPEN_PANEL: {
      const { keyState } = action;
      return {
        ...initialState,
        dataTableList: {
          isOpen: false,
        },
        [keyState]: { isOpen: true },
      };
    }
    case actionTypes.CLOSE_PANEL:
      return {
        ...initialState,
      };

    default: {
      throw new Error(`Unhandled action type: ${(action as { type: string }).type}`);
    }
  }
}
