import React, { CSSProperties, ReactNode } from 'react';
import { useProfileContext } from '@/context/profileContext';
import AdminInfo from './AdminInfo';
import UpdateAdmin from './UpdateAdmin';
import PasswordModal from './PasswordModal';

interface VisibilityProps {
  isOpen: boolean;
  children: ReactNode;
}

const Visibility: React.FC<VisibilityProps> = ({ isOpen, children }) => {
  const show: CSSProperties = isOpen
    ? { display: 'block', opacity: 1 }
    : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

interface ProfileConfig {
  ENTITY_NAME: string;
}

interface ProfileProps {
  config: ProfileConfig;
}

export default function Profile({ config }: ProfileProps): React.JSX.Element {
  const { state } = useProfileContext();
  const { update, read } = state;

  return (
    <div>
      <Visibility isOpen={read.isOpen}>
        <AdminInfo config={config} />
      </Visibility>
      <Visibility isOpen={update.isOpen}>
        <UpdateAdmin config={config} />
      </Visibility>
      <PasswordModal />
    </div>
  );
}
