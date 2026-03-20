import { useEffect, useState } from 'react';
import { Modal } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { UnknownAction } from 'redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { useAppContext } from '@/context/appContext';
import { selectDeletedItem } from '@/redux/crud/selectors';
import { valueByString } from '@/utils/helpers';

import useLanguage from '@/locale/useLanguage';

interface DeleteModalConfig {
  entity: string;
  deleteModalLabels: string[];
  deleteMessage?: string;
  modalTitle?: string;
}

interface DeleteModalProps {
  config: DeleteModalConfig;
}

interface DeletedItemState {
  current: Record<string, unknown> | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface CrudContextState {
  isModalOpen: boolean;
}

interface ContextActionToggle {
  open: () => void;
  close: () => void;
}

interface ContextActionCollapsible extends ContextActionToggle {
  collapse: () => void;
}

interface CrudContextActions {
  modal: ContextActionToggle;
  panel: ContextActionCollapsible;
  readBox: ContextActionCollapsible;
  editBox: ContextActionToggle;
  advancedBox: ContextActionToggle;
  collapsedBox: ContextActionCollapsible;
}

interface AppContextActions {
  navMenu: ContextActionCollapsible;
  app: {
    open: (appName: string) => void;
    default: () => void;
  };
}

export default function DeleteModal({ config }: DeleteModalProps): JSX.Element {
  const translate = useLanguage();
  let {
    entity,
    deleteModalLabels,
    deleteMessage = translate('are_you_sure_you_want_to_delete'),
    modalTitle = translate('delete_confirmation'),
  } = config;
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem) as DeletedItemState;
  const { state, crudContextAction } = useCrudContext() as {
    state: CrudContextState;
    crudContextAction: CrudContextActions;
    crudContextSelector: unknown;
  };
  const { appContextAction } = useAppContext() as {
    state: unknown;
    appContextAction: AppContextActions;
  };
  const { panel, readBox } = crudContextAction;
  const { navMenu } = appContextAction;
  const { isModalOpen } = state;
  const { modal } = crudContextAction;
  const [displayItem, setDisplayItem] = useState<string>('');

  useEffect(() => {
    if (isSuccess) {
      console.log('🚀 ~ useEffect ~ DeleteModal isSuccess:', isSuccess);
      modal.close();
      dispatch(crud.list({ entity }));
      // dispatch(crud.resetAction({actionType:"delete"})); // check here maybe it wrong
    }
    if (current) {
      let labels = deleteModalLabels.map((x: string) => valueByString(current, x)).join(' ');

      setDisplayItem(labels);
    }
  }, [isSuccess, current]);

  const handleOk = (): void => {
    const id = (current as Record<string, unknown>)._id;
    dispatch(crud.delete({ entity, id }));
    readBox.close();
    modal.close();
    panel.close();
    navMenu.collapse();
  };
  const handleCancel = (): void => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title={modalTitle}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <p>
        {deleteMessage}
        {displayItem}
      </p>
    </Modal>
  );
}
