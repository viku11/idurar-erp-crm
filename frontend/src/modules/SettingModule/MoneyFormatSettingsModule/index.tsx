import React from 'react';
import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import SettingsForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

interface MoneyFormatSettingsConfig {
  SETTINGS_TITLE: string;
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

interface MoneyFormatSettingsModuleProps {
  config: MoneyFormatSettingsConfig;
}

export default function MoneyFormatSettingsModule({ config }: MoneyFormatSettingsModuleProps): React.JSX.Element {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('Default Currency')}
        description={translate('Select Default Currency')}
      >
        <SettingsForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}
