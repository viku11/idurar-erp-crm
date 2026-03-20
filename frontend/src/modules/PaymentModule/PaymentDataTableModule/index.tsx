import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

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

interface PaymentConfig {
  entity: string;
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  disableAdd?: boolean;
  dataTableColumns: DataTableColumn[];
  searchConfig: SearchConfig;
  deleteModalLabels: string[];
}

interface PaymentDataTableModuleProps {
  config: PaymentConfig;
}

export default function PaymentDataTableModule({ config }: PaymentDataTableModuleProps) {
  return (
    <ErpLayout>
      {/* @ts-ignore - extra is optional at runtime but typed as required in the inferred JSX props */}
      <ErpPanel config={config}></ErpPanel>
    </ErpLayout>
  );
}
