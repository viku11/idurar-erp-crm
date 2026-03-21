import React from 'react';

import ProfileModule from '@/modules/ProfileModule';
import useLanguage from '@/locale/useLanguage';

interface ProfileConfig {
  entity: string;
  PANEL_TITLE: string;
  ENTITY_NAME: string;
}

export default function Profile(): React.ReactElement {
  const entity: string = 'profile';
  const translate: (value: string) => string = useLanguage();

  const Labels: { PANEL_TITLE: string; ENTITY_NAME: string } = {
    PANEL_TITLE: translate('profile'),
    ENTITY_NAME: translate('profile'),
  };

  const config: ProfileConfig = {
    entity,
    ...Labels,
  };
  return <ProfileModule config={config} />;
}
