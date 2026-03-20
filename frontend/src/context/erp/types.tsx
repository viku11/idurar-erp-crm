export const OPEN_MODAL: 'OPEN_MODAL' = 'OPEN_MODAL';
export const CLOSE_MODAL: 'CLOSE_MODAL' = 'CLOSE_MODAL';

export const OPEN_PANEL: 'OPEN_PANEL' = 'OPEN_PANEL';
export const CLOSE_PANEL: 'CLOSE_PANEL' = 'CLOSE_PANEL';
export const COLLAPSE_PANEL: 'COLLAPSE_PANEL' = 'COLLAPSE_PANEL';

export type ErpActionType =
  | typeof OPEN_MODAL
  | typeof CLOSE_MODAL
  | typeof OPEN_PANEL
  | typeof CLOSE_PANEL
  | typeof COLLAPSE_PANEL;
