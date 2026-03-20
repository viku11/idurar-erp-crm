export const OPEN_MODAL = 'OPEN_MODAL' as const;
export const CLOSE_MODAL = 'CLOSE_MODAL' as const;

export const OPEN_ADVANCED_BOX = 'OPEN_ADVANCED_BOX' as const;
export const CLOSE_ADVANCED_BOX = 'CLOSE_ADVANCED_BOX' as const;

export const OPEN_EDIT_BOX = 'OPEN_EDIT_BOX' as const;
export const CLOSE_EDIT_BOX = 'CLOSE_EDIT_BOX' as const;

export const OPEN_PANEL = 'OPEN_PANEL' as const;
export const CLOSE_PANEL = 'CLOSE_PANEL' as const;
export const COLLAPSE_PANEL = 'COLLAPSE_PANEL' as const;

export const OPEN_BOX = 'OPEN_BOX' as const;
export const CLOSE_BOX = 'CLOSE_BOX' as const;
export const COLLAPSE_BOX = 'COLLAPSE_BOX' as const;

export const OPEN_READ_BOX = 'OPEN_READ_BOX' as const;
export const CLOSE_READ_BOX = 'CLOSE_READ_BOX' as const;
export const COLLAPSE_READ_BOX = 'COLLAPSE_READ_BOX' as const;

export type CrudActionType =
  | typeof OPEN_MODAL
  | typeof CLOSE_MODAL
  | typeof OPEN_ADVANCED_BOX
  | typeof CLOSE_ADVANCED_BOX
  | typeof OPEN_EDIT_BOX
  | typeof CLOSE_EDIT_BOX
  | typeof OPEN_PANEL
  | typeof CLOSE_PANEL
  | typeof COLLAPSE_PANEL
  | typeof OPEN_BOX
  | typeof CLOSE_BOX
  | typeof COLLAPSE_BOX
  | typeof OPEN_READ_BOX
  | typeof CLOSE_READ_BOX
  | typeof COLLAPSE_READ_BOX;
