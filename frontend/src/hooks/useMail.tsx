import { erp } from '@/redux/erp/actions';

import { useSelector, useDispatch } from 'react-redux';

import { selectMailItem } from '@/redux/erp/selectors';

interface UseMailProps {
  entity: string;
}

interface MailState {
  result: unknown;
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

export default function useMail({ entity }: UseMailProps) {
  const { isLoading } = useSelector(selectMailItem) as MailState;
  const dispatch = useDispatch();

  const send = (id: string) => {
    const jsonData = { id };
    dispatch(erp.mail({ entity, jsonData }) as any);
  };

  return { send, isLoading };
}
