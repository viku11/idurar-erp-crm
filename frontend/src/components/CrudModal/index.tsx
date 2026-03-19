import { useEffect, ReactNode } from 'react';
import { Modal } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import type { ThunkDispatch } from '@reduxjs/toolkit';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectDeletedItem } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';

interface DeleteModalConfig {
  entity: string;
  modalTitle?: string;
}

interface DeleteModalProps {
  config: DeleteModalConfig;
  children: ReactNode;
}

interface DeletedItemState {
  result: Record<string, unknown> | null;
  current: { _id: string } | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export default function DeleteModal({ config, children }: DeleteModalProps): JSX.Element {
  const translate = useLanguage();
  let { entity, modalTitle = translate('delete_confirmation') } = config;
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, never>>();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem) as DeletedItemState;
  const { state, crudContextAction } = useCrudContext();
  const { isModalOpen } = state;
  const { modal } = crudContextAction;

  useEffect(() => {
    if (isSuccess) {
      modal.close();
      dispatch(crud.list({ entity }));
    }
  }, [isSuccess]);

  const handleOk = (): void => {
    const id = current!._id;
    dispatch(crud.delete({ entity, id }));
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
      {children}
    </Modal>
  );
}
