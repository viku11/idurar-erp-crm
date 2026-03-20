import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';

interface AppSettings {
  idurar_app_date_format?: string;
}

interface UseDateReturn {
  dateFormat: string;
}

const useDate = (): UseDateReturn => {
  const app_settings = useSelector(selectAppSettings) as AppSettings | undefined;
  const dateFormat: string = app_settings?.idurar_app_date_format ?? 'DD/MM/YYYY';
  return {
    dateFormat,
  };
};

export default useDate;
