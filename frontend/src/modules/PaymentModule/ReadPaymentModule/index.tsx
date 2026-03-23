import { ErpLayout } from '@/layout';
import ReadItem from './components/ReadItem';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById, selectCurrentItem } from '@/redux/erp/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

interface ReadPaymentConfig {
  entity: string;
  ENTITY_NAME: string;
  [key: string]: unknown;
}

interface ReadPaymentModuleProps {
  config: ReadPaymentConfig;
}

export default function ReadPaymentModule({ config }: ReadPaymentModuleProps) {
  const dispatch = useDispatch();

  const { id } = useParams<{ id: string }>();
  let item = useSelector(selectItemById(id as string));

  useEffect(() => {
    if (item) {
      // @ts-ignore - erp.currentItem returns a thunk action
      dispatch(erp.currentItem({ data: item as Record<string, unknown> }));
    } else {
      // @ts-ignore - erp.read returns a thunk action
      dispatch(erp.read({ entity: config.entity, id: id as string }));
    }
  }, [item]);

  const { result: currentResult } = useSelector(selectCurrentItem);

  item = currentResult as typeof item;
  return (
    <ErpLayout>
      {item ? <ReadItem config={config} selectedItem={item as unknown as React.ComponentProps<typeof ReadItem>['selectedItem']} /> : <PageLoader />}
    </ErpLayout>
  );
}
