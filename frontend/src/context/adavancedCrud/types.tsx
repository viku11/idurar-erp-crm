export const OPEN_MODAL = 'OPEN_MODAL' as const;
export const CLOSE_MODAL = 'CLOSE_MODAL' as const;

export const OPEN_PANEL = 'OPEN_PANEL' as const;
export const CLOSE_PANEL = 'CLOSE_PANEL' as const;
export const COLLAPSE_PANEL = 'COLLAPSE_PANEL' as const;

export type ModalActionType = typeof OPEN_MODAL | typeof CLOSE_MODAL;
export type PanelActionType = typeof OPEN_PANEL | typeof CLOSE_PANEL | typeof COLLAPSE_PANEL;
export type AdvancedCrudActionType = ModalActionType | PanelActionType;
