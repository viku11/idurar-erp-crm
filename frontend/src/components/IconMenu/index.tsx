import React from 'react';
import {
  DesktopOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CreditCardOutlined,
  BankOutlined,
} from '@ant-design/icons';

type AntdIconComponent = typeof DesktopOutlined;

type IconName =
  | 'DesktopOutlined'
  | 'SettingOutlined'
  | 'CustomerServiceOutlined'
  | 'FileTextOutlined'
  | 'FileSyncOutlined'
  | 'DashboardOutlined'
  | 'TeamOutlined'
  | 'UserOutlined'
  | 'CreditCardOutlined'
  | 'BankOutlined'
  | 'Default';

interface IconMenuProps {
  name?: IconName | string;
}

const elements: Record<string, AntdIconComponent> = {
  DesktopOutlined: DesktopOutlined,
  SettingOutlined: SettingOutlined,
  CustomerServiceOutlined: CustomerServiceOutlined,
  FileTextOutlined: FileTextOutlined,
  FileSyncOutlined: FileSyncOutlined,
  DashboardOutlined: DashboardOutlined,
  TeamOutlined: TeamOutlined,
  UserOutlined: UserOutlined,
  CreditCardOutlined: CreditCardOutlined,
  BankOutlined: BankOutlined,
  Default: DesktopOutlined,
};

export const IconMenu: React.FC<IconMenuProps> = ({ name }): JSX.Element => {
  const IconTag = elements[name || 'Default'] || SettingOutlined;
  return <IconTag onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
};
