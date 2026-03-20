import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import ReadItem from '@/modules/ErpPanelModule/ReadItem';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';

import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

interface ErpConfig {
  entity: string;
  ENTITY_NAME: string;
}

interface ErpClient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ErpLineItem {
  _id: string;
  itemName: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
}

interface ErpData {
  _id?: string;
  status: string;
  paymentStatus?: string;
  client: ErpClient;
  subTotal: number;
  taxTotal: number;
  taxRate: number;
  total: number;
  credit: number;
  number: number;
  year: number;
  currency?: string;
  items?: ErpLineItem[];
  invoice?: ErpData & { items?: ErpLineItem[] };
  [key: string]: unknown;
}

interface ReadItemState {
  result: ErpData | null;
  current: ErpData | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface ReadQuoteModuleProps {
  config: ErpConfig;
}

export default function ReadQuoteModule({ config }: ReadQuoteModuleProps) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }) as unknown as Parameters<typeof dispatch>[0]);
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem) as ReadItemState;

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
          <ReadItem config={config} selectedItem={currentResult ?? undefined} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
