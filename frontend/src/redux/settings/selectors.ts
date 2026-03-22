import { createSelector } from 'reselect';

interface SettingsResult {
  crm_settings: Record<string, unknown>;
  finance_settings: Record<string, unknown>;
  company_settings: Record<string, unknown>;
  app_settings: Record<string, unknown>;
  money_format_settings: Record<string, unknown>;
}

interface SettingsState {
  result: SettingsResult;
  isLoading: boolean;
  isSuccess: boolean;
}

interface RootState {
  settings: SettingsState;
}

export const selectSettings = (state: RootState): SettingsState => state.settings;

export const selectCurrentSettings = createSelector(
  [selectSettings],
  (settings: SettingsState): SettingsResult => settings.result
);

export const selectMoneyFormat = createSelector(
  [selectCurrentSettings],
  (settings: SettingsResult): Record<string, unknown> => settings.money_format_settings
);

export const selectAppSettings = createSelector(
  [selectCurrentSettings],
  (settings: SettingsResult): Record<string, unknown> => settings.app_settings
);

export const selectFinanceSettings = createSelector(
  [selectCurrentSettings],
  (settings: SettingsResult): Record<string, unknown> => settings.finance_settings
);

export const selectCrmSettings = createSelector(
  [selectCurrentSettings],
  (settings: SettingsResult): Record<string, unknown> => settings.crm_settings
);

export const selectCompanySettings = createSelector(
  [selectCurrentSettings],
  (settings: SettingsResult): Record<string, unknown> => settings.company_settings
);
