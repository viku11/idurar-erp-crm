export const OPEN_NAV_MENU = 'OPEN_NAV_MENU' as const;
export const CLOSE_NAV_MENU = 'CLOSE_NAV_MENU' as const;
export const COLLAPSE_NAV_MENU = 'COLLAPSE_NAV_MENU' as const;
export const CHANGE_APP = 'CHANGE_APP' as const;
export const DEFAULT_APP = 'DEFAULT_APP' as const;

export type AppContextActionType =
  | typeof OPEN_NAV_MENU
  | typeof CLOSE_NAV_MENU
  | typeof COLLAPSE_NAV_MENU
  | typeof CHANGE_APP
  | typeof DEFAULT_APP;
