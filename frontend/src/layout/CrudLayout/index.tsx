import { ReactNode, useEffect, useState } from 'react';

import DefaultLayout from '../DefaultLayout';

import SidePanel from '@/components/SidePanel';
import { Layout } from 'antd';
import { useCrudContext } from '@/context/crud';
import { useAppContext } from '@/context/appContext';

const { Content } = Layout;

interface ContentBoxProps {
  children: ReactNode;
}

const ContentBox = ({ children }: ContentBoxProps): JSX.Element => {
  const { state: stateCrud, crudContextAction } = useCrudContext();
  const { state: stateApp } = useAppContext();
  const { isPanelClose } = stateCrud;
  // const { isNavMenuClose } = stateApp;
  const { panel } = crudContextAction;

  const [isSidePanelClose, setSidePanel] = useState<boolean>(isPanelClose);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPanelClose) {
      timer = setTimeout(() => {
        setSidePanel(isPanelClose);
      }, 200);
    } else {
      setSidePanel(isPanelClose);
    }

    return () => clearTimeout(timer);
  }, [isPanelClose]);

  // useEffect(() => {
  //   if (!isNavMenuClose) {
  //     panel.close();
  //   }
  // }, [isNavMenuClose]);
  return (
    <Content
      className="whiteBox shadow layoutPadding"
      style={{
        margin: '30px auto',
        width: '100%',
        maxWidth: '100%',
        flex: 'none',
      }}
    >
      {children}
    </Content>
  );
};

interface SidePanelConfig {
  ADD_NEW_ENTITY: ReactNode;
  PANEL_TITLE: ReactNode;
}

interface CrudLayoutProps {
  children: ReactNode;
  config: SidePanelConfig;
  sidePanelTopContent: ReactNode;
  sidePanelBottomContent: ReactNode;
  fixHeaderPanel: ReactNode;
}

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}: CrudLayoutProps): JSX.Element {
  return (
    <>
      <DefaultLayout>
        <SidePanel
          config={config}
          topContent={sidePanelTopContent}
          bottomContent={sidePanelBottomContent}
          fixHeaderPanel={fixHeaderPanel}
        ></SidePanel>

        <ContentBox> {children}</ContentBox>
      </DefaultLayout>
    </>
  );
}
