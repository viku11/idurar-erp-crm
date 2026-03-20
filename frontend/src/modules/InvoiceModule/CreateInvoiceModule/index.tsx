import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import InvoiceForm from '@/modules/InvoiceModule/Forms/InvoiceForm';

interface CreateInvoiceConfig {
  entity: string;
  [key: string]: unknown;
}

interface CreateInvoiceModuleProps {
  config: CreateInvoiceConfig;
}

export default function CreateInvoiceModule({ config }: CreateInvoiceModuleProps) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={InvoiceForm} />
    </ErpLayout>
  );
}
