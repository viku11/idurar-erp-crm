import { Dropdown, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import { EllipsisOutlined, EyeOutlined, EditOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

interface RecordItem {
  _id: string;
  [key: string]: unknown;
}

interface RecentTableProps {
  entity: string;
  dataTableColumns: ColumnsType<RecordItem>;
}

export default function RecentTable({ entity, dataTableColumns }: RecentTableProps) {
  const translate = useLanguage();

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
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRead = (record: RecordItem): void => {
    dispatch(erp.currentItem({ data: record }) as never);
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record: RecordItem): void => {
    dispatch(erp.currentAction({ actionType: 'update', data: record }) as never);
    navigate(`/${entity}/update/${record._id}`);
  };
  const handleDownload = (record: RecordItem): void => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  const columnsWithAction: ColumnsType<RecordItem> = [
    ...dataTableColumns,
    {
      title: '',
      key: 'action',
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
                case 'download':
                  handleDownload(record);
                  break;

                default:
                  break;
              }
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

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  const firstFiveItems = (): RecordItem[] => {
    if (isSuccess && result) return (result as RecordItem[]).slice(0, 5);
    return [];
  };

  return (
    <Table
      columns={columnsWithAction}
      rowKey={(item: RecordItem) => item._id}
      dataSource={isSuccess ? firstFiveItems() : []}
      pagination={false}
      loading={isLoading}
      scroll={{ x: true }}
    />
  );
}
