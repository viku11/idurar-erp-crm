import { Button, Badge } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

const RocketIcon: React.FC = RocketOutlined as unknown as React.FC;

export default function UpgradeButton(): React.ReactElement {
  const translate: (value: string) => string = useLanguage();

  return (
    <Badge count={1} size="small">
      <Button
        type="primary"
        style={{
          float: 'right',
          marginTop: '5px',
          cursor: 'pointer',
          background: '#16923e',
          boxShadow: '0 2px 0 rgb(82 196 26 / 20%)',
        }}
        icon={<RocketIcon />}
        onClick={(): void => {
          window.open(`https://entreprise.idurarapp.com`);
        }}
      >
        {translate('Try Entreprise Version')}
      </Button>
    </Badge>
  );
}

console.log(
  '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
);
