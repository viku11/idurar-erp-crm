import React from 'react';
import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import SettingsForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

interface CompanySettingsModuleConfig {
  SETTINGS_TITLE: string;
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

interface CompanySettingsModuleProps {
  config: CompanySettingsModuleConfig;
}

export default function CompanySettingsModule({ config }: CompanySettingsModuleProps): React.JSX.Element {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('Company Settings')}
        description={translate('Update your Company informations')}
      >
        <SettingsForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}
