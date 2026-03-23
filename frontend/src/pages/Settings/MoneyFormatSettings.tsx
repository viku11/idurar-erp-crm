import React from 'react';

import useLanguage from '@/locale/useLanguage';

import MoneyFormatSettingsModule from '@/modules/SettingModule/MoneyFormatSettingsModule';

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

export default function MoneyFormatSettings(): React.JSX.Element {
  const translate = useLanguage();

  const entity: string = 'setting';

  const Labels: Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),
    SETTINGS_TITLE: translate('Money Format Settings'),
  };

  const configPage: ConfigPage = {
    entity,
    settingsCategory: 'money_format_settings',
    ...Labels,
  };
  return <MoneyFormatSettingsModule config={configPage} />;
}
