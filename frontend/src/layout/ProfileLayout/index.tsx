import { ProfileContextProvider } from '@/context/profileContext';
import React from 'react';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return <ProfileContextProvider>{children}</ProfileContextProvider>;
};

export default ProfileLayout;
