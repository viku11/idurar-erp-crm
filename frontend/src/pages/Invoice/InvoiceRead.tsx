import useLanguage from '@/locale/useLanguage';
import ReadInvoiceModule from '@/modules/InvoiceModule/ReadInvoiceModule';

interface Labels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  RECORD_ENTITY: string;
  [key: string]: unknown;
}

interface ConfigPage extends Labels {
  entity: string;
}

export default function InvoiceRead(): JSX.Element {
  const entity: string = 'invoice';
  const translate = useLanguage();
  const Labels: Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),

    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage: ConfigPage = {
    entity,
    ...Labels,
  };
  return <ReadInvoiceModule config={configPage} />;
}
