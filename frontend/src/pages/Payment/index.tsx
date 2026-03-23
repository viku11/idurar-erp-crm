import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';

import { useMoney, useDate } from '@/settings';

interface SearchConfig {
  entity: string;
  displayLabels: string[];
  searchFields: string;
  outputValue: string;
}

interface DataTableColumn {
  title: string;
  dataIndex: string | string[];
  render?: (value: unknown, record: Record<string, unknown>) => unknown;
  onCell?: () => { style: Record<string, string> };
}

interface Labels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
}

interface PaymentConfig extends Labels {
  entity: string;
  disableAdd: boolean;
  dataTableColumns: DataTableColumn[];
  searchConfig: SearchConfig;
  deleteModalLabels: string[];
}

export default function Payment(): JSX.Element {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const searchConfig: SearchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels: string[] = ['number'];
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
      title: translate('Amount'),
      dataIndex: 'amount',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount: unknown, record: Record<string, unknown>) =>
        moneyFormatter({ amount: amount as number, currency_code: record.currency as string }),
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date: unknown) => {
        return dayjs(date as string).format(dateFormat);
      },
    },
    {
      title: translate('Number'),
      dataIndex: ['invoice', 'number'],
    },
    {
      title: translate('year'),
      dataIndex: ['invoice', 'year'],
    },
    {
      title: translate('Payment Mode'),
      dataIndex: ['paymentMode', 'name'],
    },
  ];

  const entity: string = 'payment';

  const labels: Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  const configPage: Labels & { entity: string } = {
    entity,
    ...labels,
  };
  const config: PaymentConfig = {
    ...configPage,
    disableAdd: true,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <PaymentDataTableModule config={config} />;
}
