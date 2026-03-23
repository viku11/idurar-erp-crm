import { ErpLayout } from '@/layout';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById, selectCurrentItem } from '@/redux/erp/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Payment from './components/Payment';

interface RecordPaymentModuleConfig {
  entity: string;
  ENTITY_NAME: string;
}

interface RecordPaymentModuleProps {
  config: RecordPaymentModuleConfig;
}

export default function RecordPaymentModule({ config }: RecordPaymentModuleProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch: (action: any) => void = useDispatch();
  const { id } = useParams();

  let item = useSelector(selectItemById(id as string));

  useEffect(() => {
    if (item) {
      dispatch(erp.currentItem({ data: item as Record<string, unknown> }));
    } else {
      dispatch(erp.read({ entity: config.entity, id: id as string }));
    }
  }, [item, id]);

  const { result: currentResult } = useSelector(selectCurrentItem);
  item = currentResult as typeof item;

  useEffect(() => {
    dispatch(erp.currentAction({ actionType: 'recordPayment', data: item as Record<string, unknown> }));
  }, [item]);

  return (
    <ErpLayout>
      {item ? <Payment config={config} currentItem={currentResult as React.ComponentProps<typeof Payment>['currentItem']} /> : <PageLoader />}
    </ErpLayout>
  );
}
