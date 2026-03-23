import React from 'react';
import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import MoneyFormSettingForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

interface MoneyFormatSettingsModuleConfig {
  SETTINGS_TITLE: string;
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

interface MoneyFormatSettingsModuleProps {
  config: MoneyFormatSettingsModuleConfig;
}

export default function MoneyFormatSettingsModule({ config }: MoneyFormatSettingsModuleProps): React.JSX.Element {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('Finance Settings')}
        description={translate('Update Company Finance Settings')}
      >
        <MoneyFormSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}
