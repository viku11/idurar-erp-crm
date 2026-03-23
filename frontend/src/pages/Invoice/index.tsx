import { type ReactNode } from 'react';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';

interface SearchConfig {
  entity: string;
  displayLabels: string[];
  searchFields: string;
}

interface DataTableColumn {
  title: string;
  dataIndex: string | string[];
  render?: (value: unknown, record: Record<string, unknown>) => ReactNode;
  onCell?: () => Record<string, unknown>;
}

interface Labels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  RECORD_ENTITY: string;
}

interface ConfigPage extends Labels {
  entity: string;
}

interface Config extends ConfigPage {
  dataTableColumns: DataTableColumn[];
  searchConfig: SearchConfig;
  deleteModalLabels: string[];
}

export default function Invoice(): ReactNode {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity: string = 'invoice';
  const { moneyFormatter } = useMoney();

  const searchConfig: SearchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels: string[] = ['number', 'client.name'];
  const dataTableColumns: DataTableColumn[] = [
    {
      title: translate('Number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date: unknown): string => {
        return dayjs(date as string).format(dateFormat);
      },
    },
    {
      title: translate('expired Date'),
      dataIndex: 'expiredDate',
      render: (date: unknown): string => {
        return dayjs(date as string).format(dateFormat);
      },
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: (): Record<string, unknown> => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total: unknown, record: Record<string, unknown>): string => {
        return moneyFormatter({ amount: total as number, currency_code: record.currency as string });
      },
    },
    {
      title: translate('paid'),
      dataIndex: 'credit',
      onCell: (): Record<string, unknown> => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total: unknown, record: Record<string, unknown>): string =>
        moneyFormatter({ amount: total as number, currency_code: record.currency as string }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
    },
  ];

  const labels: Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),

    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage: ConfigPage = {
    entity,
    ...labels,
  };
  const config: Config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <InvoiceDataTableModule config={config} />;
}
