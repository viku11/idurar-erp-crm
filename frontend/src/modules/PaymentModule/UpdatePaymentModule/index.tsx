import { ErpLayout } from '@/layout';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import NotFound from '@/components/NotFound';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Payment from './components/Payment';
import { selectReadItem } from '@/redux/erp/selectors';

interface UpdatePaymentModuleConfig {
  entity: string;
  ENTITY_NAME: string;
}

interface UpdatePaymentModuleProps {
  config: UpdatePaymentModuleConfig;
}

interface ReadItemState {
  result: unknown;
  isSuccess: boolean;
  isLoading: boolean;
}

export default function UpdatePaymentModule({ config }: UpdatePaymentModuleProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id: id as string }) as never);
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem) as ReadItemState;

  useLayoutEffect(() => {
    if (currentResult) {
      dispatch(erp.currentAction({ actionType: 'update', data: currentResult as Record<string, unknown> }) as never);
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
          <Payment config={config} currentItem={currentResult as { _id: string; invoice?: { _id: string; [key: string]: unknown }; [key: string]: unknown }} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
