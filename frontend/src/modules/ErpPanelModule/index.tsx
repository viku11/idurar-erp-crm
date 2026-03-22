import { useLayoutEffect } from 'react';

import DataTable from './DataTable';

import Delete from './DeleteItem';

import { useDispatch } from 'react-redux';
// @ts-ignore - actions.js is untyped
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';

import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ErpRecord {
  _id: string;
  [key: string]: unknown;
}

interface SearchConfig {
  entity?: string;
}

interface ErpPanelConfig {
  ADD_NEW_ENTITY: string;
  DATATABLE_TITLE: string;
  entity: string;
  dataTableColumns: ColumnsType<ErpRecord>;
  disableAdd?: boolean;
  searchConfig?: SearchConfig;
  deleteModalLabels: string[];
  deleteMessage?: string;
  modalTitle?: string;
}

type MenuItem = Required<MenuProps>['items'][number];

interface ErpPanelProps {
  config: ErpPanelConfig;
  extra?: MenuItem[];
}

export default function ErpPanel({ config, extra }: ErpPanelProps): React.JSX.Element {
  // @ts-ignore - erp actions are thunks from untyped JS module; dispatch must accept them
  const dispatch: (action: unknown) => void = useDispatch();
  const { state } = useErpContext();
  const { deleteModal } = state;

  const dispatcher = (): void => {
    dispatch(erp.resetState());
  };

  useLayoutEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <DataTable config={config} extra={extra} />
      <Delete config={config} isOpen={deleteModal.isOpen} />
    </>
  );
}
