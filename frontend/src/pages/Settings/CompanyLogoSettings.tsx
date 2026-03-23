import useLanguage from '@/locale/useLanguage';

import CompanyLogoSettingsModule from '@/modules/SettingModule/CompanyLogoSettingsModule';

interface Labels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  SETTINGS_TITLE: string;
}

interface ConfigPage extends Labels {
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

export default function AppSettings(): React.JSX.Element {
  const translate = useLanguage();

  const entity: string = 'setting';

  const Labels: Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),
    SETTINGS_TITLE: translate('General Settings'),
  };

  const configPage: ConfigPage = {
    entity,
    settingsCategory: 'app_settings',
    ...Labels,
  };

  return <CompanyLogoSettingsModule config={configPage} />;
}
