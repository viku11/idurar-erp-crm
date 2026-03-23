import NotFound from '@/components/NotFound';

import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import QuoteForm from '@/modules/QuoteModule/Forms/QuoteForm';

import PageLoader from '@/components/PageLoader';

import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

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

interface UpdateQuoteModuleProps {
  config: ErpConfig;
}

export default function UpdateQuoteModule({ config }: UpdateQuoteModuleProps) {
  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id: id as string }) as unknown as Parameters<typeof dispatch>[0]);
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem) as ReadItemState;

  useLayoutEffect(() => {
    if (currentResult) {
      dispatch(erp.currentAction({ actionType: 'update', data: currentResult }) as unknown as Parameters<typeof dispatch>[0]);
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
          <UpdateItem config={config} UpdateForm={QuoteForm as React.ComponentType<{subTotal: number; current: unknown}>} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
