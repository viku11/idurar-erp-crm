import React from 'react';

import useLanguage from '@/locale/useLanguage';
import UpdateInvoiceModule from '@/modules/InvoiceModule/UpdateInvoiceModule';

interface InvoiceLabels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  RECORD_ENTITY: string;
}

interface InvoiceConfigPage extends InvoiceLabels {
  entity: string;
  [key: string]: unknown;
}

const InvoiceUpdate: React.FC = () => {
  const entity: string = 'invoice';
  const translate = useLanguage();
  const Labels: InvoiceLabels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),
    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage: InvoiceConfigPage = {
    entity,
    ...Labels,
  };
  return <UpdateInvoiceModule config={configPage} />;
};

export default InvoiceUpdate;
