import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
// @ts-ignore
import ReadItem from '@/modules/ErpPanelModule/ReadItem';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import type { ThunkDispatch } from 'redux-thunk';
import type { UnknownAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

interface ReadInvoiceModuleConfig {
  entity: string;
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
  RECORD_ENTITY: string;
}

interface ReadInvoiceModuleProps {
  config: ReadInvoiceModuleConfig;
}

interface ReadItemState {
  result: Record<string, unknown> | null;
  current: Record<string, unknown> | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export default function ReadInvoiceModule({ config }: ReadInvoiceModuleProps) {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>();
  const { id } = useParams<{ id: string }>();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
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
          <ReadItem config={config} selectedItem={currentResult} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
