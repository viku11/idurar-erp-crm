import React from 'react';
import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import GeneralSettingForm from './forms/GeneralSettingForm';
import useLanguage from '@/locale/useLanguage';

interface GeneralSettingsModuleConfig {
  SETTINGS_TITLE: string;
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

interface GeneralSettingsModuleProps {
  config: GeneralSettingsModuleConfig;
}

export default function GeneralSettingsModule({ config }: GeneralSettingsModuleProps): React.JSX.Element {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('App Settings')}
        description={translate('Update your app configuration')}
      >
        <GeneralSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}
