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

interface ReadItemState {
  result: Record<string, unknown> | null;
  isSuccess: boolean;
  isLoading: boolean;
}

interface UpdateQuoteModuleConfig {
  entity: string;
  [key: string]: unknown;
}

interface UpdateQuoteModuleProps {
  config: UpdateQuoteModuleConfig;
}

export default function UpdateQuoteModule({ config }: UpdateQuoteModuleProps) {
  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }) as unknown as never);
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem) as unknown as ReadItemState;

  useLayoutEffect(() => {
    if (currentResult) {
      dispatch(erp.currentAction({ actionType: 'update', data: currentResult }) as unknown as never);
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
          <UpdateItem config={config} UpdateForm={QuoteForm} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
