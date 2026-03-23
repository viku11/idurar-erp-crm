import React from 'react';
import {
  SettingOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileImageOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

import TabsContent from '@/components/TabsContent/TabsContent';

import CompanyLogoSettings from './CompanyLogoSettings';
import GeneralSettings from './GeneralSettings';
import CompanySettings from './CompanySettings';
import FinanceSettings from './FinanceSettings';
import MoneyFormatSettings from './MoneyFormatSettings';

import useLanguage from '@/locale/useLanguage';
import { useParams } from 'react-router-dom';

interface ContentItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function Settings(): React.ReactElement {
  const translate = useLanguage();
  const { settingsKey } = useParams<{ settingsKey: string }>();
  const content: ContentItem[] = [
    {
      key: 'general_settings',
      label: translate('General Settings'),
      icon: <SettingOutlined />,
      children: <GeneralSettings />,
    },
    {
      key: 'company_settings',
      label: translate('Company Settings'),
      icon: <TrophyOutlined />,
      children: <CompanySettings />,
    },
    {
      key: 'company_logo',
      label: translate('Company Logo'),
      icon: <FileImageOutlined />,
      children: <CompanyLogoSettings />,
    },
    {
      key: 'currency_settings',
      label: translate('Currency Settings'),
      icon: <DollarOutlined />,
      children: <MoneyFormatSettings />,
    },
    {
      key: 'finance_settings',
      label: translate('Finance Settings'),
      icon: <CreditCardOutlined />,
      children: <FinanceSettings />,
    },
  ];

  const pageTitle: string = translate('Settings');

  return <TabsContent defaultActiveKey={settingsKey ?? 'general_settings'} content={content} pageTitle={pageTitle} />;
}
