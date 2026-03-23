import useLanguage from '@/locale/useLanguage';
import UpdatePaymentModule from '@/modules/PaymentModule/UpdatePaymentModule';

interface PaymentLabels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
}

interface PaymentConfigPage extends PaymentLabels {
  entity: string;
  [key: string]: unknown;
}

export default function PaymentUpdate(): JSX.Element {
  const translate = useLanguage();

  const entity: string = 'payment';

  const Labels: PaymentLabels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  const configPage: PaymentConfigPage = {
    entity,
    ...Labels,
  };
  return <UpdatePaymentModule config={configPage} />;
}
