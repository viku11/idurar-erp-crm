import NotFound from '@/components/NotFound';

import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import InvoiceForm from '@/modules/InvoiceModule/Forms/InvoiceForm';

import PageLoader from '@/components/PageLoader';

import { erp } from '@/redux/erp/actions';

import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { settingsAction } from '@/redux/settings/actions';

interface UpdateInvoiceConfig {
  entity: string;
  [key: string]: unknown;
}

interface UpdateInvoiceModuleProps {
  config: UpdateInvoiceConfig;
}

export default function UpdateInvoiceModule({ config }: UpdateInvoiceModuleProps) {
  const dispatch = useDispatch();

  const { id } = useParams<{ id: string }>();

  useLayoutEffect(() => {
    // @ts-ignore - erp.read returns a thunk action
    dispatch(erp.read({ entity: config.entity, id: id as string }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  useLayoutEffect(() => {
    if (currentResult) {
      const data: Record<string, unknown> = { ...(currentResult as Record<string, unknown>) };
      // @ts-ignore - erp.currentAction returns a thunk action
      dispatch(erp.currentAction({ actionType: 'update', data }));
    }
  }, [currentResult]);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  } else
    return (
      <ErpLayout>
        {isSuccess ? (
          <UpdateItem config={config} UpdateForm={InvoiceForm as React.ComponentType<{subTotal: number; current: unknown}>} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
