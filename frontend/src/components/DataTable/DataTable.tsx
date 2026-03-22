import { useCallback, useEffect, ReactNode } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input } from 'antd';
import type { MenuProps, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

// @ts-ignore - shortid has no type declarations
import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

interface SearchConfig {
  searchFields?: string;
}

interface FieldConfig {
  fieldName: string;
  fieldType: string;
  [key: string]: unknown;
}

interface DataTableConfig {
  entity: string;
  dataTableColumns: ColumnsType<RecordItem>;
  DATATABLE_TITLE: string;
  fields?: FieldConfig[];
  searchConfig?: SearchConfig;
  ADD_NEW_ENTITY: string;
}

interface RecordItem {
  _id: string;
  [key: string]: unknown;
}

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
}

interface ListResult {
  items: RecordItem[];
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
  extra?: MenuProps['items'];
}

function AddNewItem({ config }: AddNewItemProps) {
  // @ts-ignore - useCrudContext is untyped from a .jsx file
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
export default function DataTable({ config, extra = [] }: DataTableProps) {
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  // @ts-ignore - useCrudContext is untyped from a .jsx file
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();

  const items: MenuProps['items'] = [
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
    ...(extra ?? []),
    {
      type: 'divider' as const,
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const handleRead = (record: RecordItem): void => {
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record: RecordItem): void {
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.currentItem({ data: record }));
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record: RecordItem): void {
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record: RecordItem): void {
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.currentItem({ data: record }));
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  let dispatchColumns: ColumnsType<RecordItem> = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  dataTableColumns = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right' as const,
      render: (_: unknown, record: RecordItem) => (
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

  const handelDataTableLoad = useCallback((pagination: TablePaginationConfig) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.list({ entity, options }));
  }, []);

  const filterTable = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // @ts-ignore - crud.list accepts different option shapes at runtime
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    // @ts-ignore - redux thunk dispatch
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = (): void => {
    // @ts-ignore - redux thunk dispatch
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
          <Button
            onClick={() => handelDataTableLoad({})}
            key={`${uniqueId()}`}
            icon={<RedoOutlined />}
          >
            {translate('Refresh')}
          </Button>,

          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table<RecordItem>
        columns={dataTableColumns}
        rowKey={(item: RecordItem) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
