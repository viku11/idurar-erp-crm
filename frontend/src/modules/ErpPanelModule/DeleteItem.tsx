import { useEffect, useState } from 'react';
import { Modal } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { useErpContext } from '@/context/erp';
import { selectDeletedItem } from '@/redux/erp/selectors';
import { valueByString } from '@/utils/helpers';

interface DeleteItemConfig {
  entity: string;
  deleteModalLabels: string[];
  deleteMessage?: string;
  modalTitle?: string;
}

interface DeleteItemProps {
  config: DeleteItemConfig;
  isOpen?: boolean;
}

interface DeletedItemState {
  current: (Record<string, unknown> & { _id: string }) | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export default function Delete({ config }: DeleteItemProps) {
  let {
    entity,
    deleteModalLabels,
    deleteMessage = 'Do you want delete : ',
    modalTitle = 'Remove Item',
  } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem) as unknown as DeletedItemState;
  const { state, erpContextAction } = useErpContext();
  const { deleteModal } = state as { deleteModal: { isOpen: boolean } };
  const { modal } = erpContextAction as { modal: { open: () => void; close: () => void } };
  const [displayItem, setDisplayItem] = useState('');

  useEffect(() => {
    if (isSuccess) {
      modal.close();
      const options = { page: 1, items: 10 };
      dispatch(erp.list({ entity, options }) as unknown as never);
    }
    if (current) {
      let labels = deleteModalLabels.map((x: string) => valueByString(current, x)).join(' ');

      setDisplayItem(labels);
    }
  }, [isSuccess, current]);

  const handleOk = () => {
    const id = current!._id;
    dispatch(erp.delete({ entity, id }) as unknown as never);
    modal.close();
  };
  const handleCancel = () => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title={modalTitle}
      open={deleteModal.isOpen}
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
