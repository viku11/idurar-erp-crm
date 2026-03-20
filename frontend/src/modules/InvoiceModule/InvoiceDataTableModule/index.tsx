import { type ReactNode } from 'react';
import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import useLanguage from '@/locale/useLanguage';
import { CreditCardOutlined } from '@ant-design/icons';

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

interface InvoiceDataTableConfig {
  entity: string;
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  RECORD_ENTITY: string;
  dataTableColumns: DataTableColumn[];
  searchConfig: SearchConfig;
  deleteModalLabels: string[];
}

interface InvoiceDataTableModuleProps {
  config: InvoiceDataTableConfig;
}

export default function InvoiceDataTableModule({ config }: InvoiceDataTableModuleProps) {
  const translate = useLanguage();
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        extra={[
          {
            label: translate('Record Payment'),
            key: 'recordPayment',
            icon: <CreditCardOutlined />,
          },
        ]}
      ></ErpPanel>
    </ErpLayout>
  );
}
