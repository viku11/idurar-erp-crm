import * as actionTypes from './types';

interface PanelState {
  isOpen: boolean;
}

interface ProfileState {
  read: PanelState;
  update: PanelState;
  passwordModal: PanelState;
  [key: string]: PanelState;
}

type ActionType =
  | { type: typeof actionTypes.OPEN_MODAL; keyState?: string | null }
  | { type: typeof actionTypes.CLOSE_MODAL; keyState?: string | null }
  | { type: typeof actionTypes.OPEN_PANEL; keyState: string | null }
  | { type: typeof actionTypes.CLOSE_PANEL; keyState?: string | null };

export const initialState: ProfileState = {
  read: {
    isOpen: true,
  },
  update: {
    isOpen: false,
  },
  passwordModal: {
    isOpen: false,
  },
};

export function contextReducer(state: ProfileState, action: ActionType): ProfileState {
  const { keyState = null } = action;
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        passwordModal: { isOpen: true },
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        passwordModal: { isOpen: false },
      };
    case actionTypes.OPEN_PANEL:
      return {
        ...initialState,
        read: {
          isOpen: false,
        },
        ...(keyState ? { [keyState]: { isOpen: true } } : {}),
      };
    case actionTypes.CLOSE_PANEL:
      return {
        ...initialState,
      };

    default: {
      throw new Error(`Unhandled action type: ${(action as { type: string }).type}`);
    }
  }
}
