import React from 'react';
import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import AppSettingForm from './forms/AppSettingForm';

import useLanguage from '@/locale/useLanguage';

interface CompanyLogoSettingsConfig {
  SETTINGS_TITLE: string;
  entity: string;
  settingsCategory: string;
  [key: string]: unknown;
}

interface CompanyLogoSettingsModuleProps {
  config: CompanyLogoSettingsConfig;
}

export default function CompanyLogoSettingsModule({ config }: CompanyLogoSettingsModuleProps): React.JSX.Element {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config} uploadSettingKey="company_logo" withUpload>
      <SetingsSection
        title={translate('Company Logo')}
        description={translate('Update Company logo')}
      >
        <AppSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}
