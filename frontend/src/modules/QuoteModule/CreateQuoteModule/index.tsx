import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import QuoteForm from '@/modules/QuoteModule/Forms/QuoteForm';

interface CreateQuoteConfig {
  entity: string;
  [key: string]: unknown;
}

interface CreateQuoteModuleProps {
  config: CreateQuoteConfig;
}

export default function CreateQuoteModule({ config }: CreateQuoteModuleProps) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={QuoteForm} />
    </ErpLayout>
  );
}
