import { useEffect } from 'react';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  RedoOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button } from 'antd';
import type { TablePaginationConfig, MenuProps } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { PageHeader } from '@ant-design/pro-layout';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import { useSelector, useDispatch } from 'react-redux';
import type { Dispatch } from 'redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import { useNavigate } from 'react-router-dom';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

interface SearchConfig {
  entity?: string;
}

interface DataRecord {
  _id: string;
  [key: string]: unknown;
}

interface DataTableConfig {
  ADD_NEW_ENTITY: string;
  DATATABLE_TITLE: string;
  entity: string;
  dataTableColumns: ColumnType<DataRecord>[];
  disableAdd?: boolean;
  searchConfig?: SearchConfig;
}

interface ErpPagination {
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}

interface ErpListResult {
  items: DataRecord[];
  pagination: ErpPagination;
}

interface ErpListState {
  result: ErpListResult;
  isLoading: boolean;
  isSuccess: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

interface AddNewItemProps {
  config: DataTableConfig;
}

function AddNewItem({ config }: AddNewItemProps) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

interface DataTableProps {
  config: DataTableConfig;
  extra?: MenuItem[];
}

export default function DataTable({ config, extra = [] }: DataTableProps) {
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;

  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems) as ErpListState;

  const { pagination, items: dataSource } = listResult;

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;

  const items: MenuItem[] = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const navigate = useNavigate();

  const handleRead = (record: DataRecord) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record: DataRecord) => {
    const data = { ...record };
    dispatch(erp.currentAction({ actionType: 'update', data }));
    navigate(`/${entity}/update/${record._id}`);
  };
  const handleDownload = (record: DataRecord) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  const handleDelete = (record: DataRecord) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleRecordPayment = (record: DataRecord) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/invoice/pay/${record._id}`);
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_: unknown, record: DataRecord) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }: { key: string }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'recordPayment':
                  handleRecordPayment(record);
                  break;
                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<Dispatch<any>>();

  const handelDataTableLoad = (pagination: TablePaginationConfig) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(erp.list({ entity, options }));
  };

  const handleRefresh = () => {
    handelDataTableLoad({ current: 1, pageSize: 10 });
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const filterTable = (value: string) => {
    const options = { equal: value, filter: searchConfig?.entity };
    dispatch(erp.list({ entity, options: options as unknown as { page: number; items: number } }));
  };

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        extra={[
          <AutoCompleteAsync
            key="search-auto-complete"
            entity={searchConfig?.entity as string}
            displayLabels={['name']}
            searchFields={'name'}
            onChange={filterTable}
            // redirectLabel={'Add New Client'}
            // withRedirect
            // urlToRedirect={'/customer'}
          />,
          <Button onClick={handleRefresh} key="refresh-button" icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,

          !disableAdd && <AddNewItem config={config} key="add-new-item" />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item: DataRecord) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
