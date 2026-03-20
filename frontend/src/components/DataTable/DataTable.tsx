import { useCallback, useEffect } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import type { MenuProps, TablePaginationConfig } from 'antd';
import { Dropdown, Table, Button, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

interface SearchConfig {
  searchFields?: string;
}

interface FieldDefinition {
  type?: string;
  label?: string;
  dataIndex?: string[];
  disableForTable?: boolean;
  color?: string;
  colors?: Record<string, string>;
  renderAsTag?: boolean;
  options?: Array<{ value: string; color?: string; label?: string }>;
}

type DataTableColumn = ColumnsType<Record<string, unknown>>[number];

interface DataTableConfig {
  entity: string;
  dataTableColumns: DataTableColumn[];
  DATATABLE_TITLE: string;
  fields?: Record<string, FieldDefinition>;
  searchConfig?: SearchConfig;
  ADD_NEW_ENTITY?: string;
}

type MenuItem = NonNullable<MenuProps['items']>[number];

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
}

interface ListResult {
  items: Record<string, unknown>[];
  pagination: PaginationState;
}

interface ListState {
  result: ListResult;
  isLoading: boolean;
  isSuccess: boolean;
}

interface AddNewItemProps {
  config: DataTableConfig;
}

interface DataTableProps {
  config: DataTableConfig;
  extra?: MenuItem[];
}

function AddNewItem({ config }: AddNewItemProps): React.ReactElement {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = (): void => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}
export default function DataTable({ config, extra = [] }: DataTableProps): React.ReactElement {
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();

  const items: NonNullable<MenuProps['items']> = [
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

  const handleRead = (record: Record<string, unknown>): void => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record: Record<string, unknown>): void {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record: Record<string, unknown>): void {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record: Record<string, unknown>): void {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  let dispatchColumns: ColumnsType<Record<string, unknown>> = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  const finalColumns: ColumnsType<Record<string, unknown>> = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_: unknown, record: Record<string, unknown>) => (
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

                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
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
            onClick={(e: React.MouseEvent) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems) as ListState;

  const { pagination, items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters?: Record<string, FilterValue | null>,
      _sorter?: SorterResult<Record<string, unknown>> | SorterResult<Record<string, unknown>>[],
      _extra?: TableCurrentDataSource<Record<string, unknown>>
    ) => {
      const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
      dispatch(crud.list({ entity, options }));
    },
    []
  );

  const filterTable = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = (): void => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
          />,
          <Button onClick={() => handelDataTableLoad({ current: 1, pageSize: 10 })} key={`${uniqueId()}`} icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,

          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table<Record<string, unknown>>
        columns={finalColumns}
        rowKey={(item: Record<string, unknown>) => item._id as string}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
