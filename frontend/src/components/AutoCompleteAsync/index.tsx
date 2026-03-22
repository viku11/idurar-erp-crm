import { useState, useEffect, useRef } from 'react';

import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import useDebounce from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

import { Select, Empty } from 'antd';
import useLanguage from '@/locale/useLanguage';

interface OptionField {
  [key: string]: string;
}

interface AutoCompleteAsyncProps {
  entity: string;
  displayLabels: string[];
  searchFields: string;
  outputValue?: string;
  redirectLabel?: string;
  withRedirect?: boolean;
  urlToRedirect?: string;
  value?: OptionField | string;
  onChange?: (value: string) => void;
}

export default function AutoCompleteAsync({
  entity,
  displayLabels,
  searchFields,
  outputValue = '_id',
  redirectLabel = 'Add New',
  withRedirect = false,
  urlToRedirect = '/',
  value, /// this is for update
  onChange, /// this is for update
}: AutoCompleteAsyncProps) {
  const translate = useLanguage();

  const addNewValue: { value: string; label: string } = { value: 'redirectURL', label: `+ ${translate(redirectLabel)}` };

  const [selectOptions, setOptions] = useState<(OptionField | string)[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

  const isUpdating = useRef<boolean>(true);
  const isSearching = useRef<boolean>(false);

  const [searching, setSearching] = useState<boolean>(false);

  const [valToSearch, setValToSearch] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>('');

  const navigate = useNavigate();

  const handleSelectChange = (newValue: string | undefined): void => {
    isUpdating.current = false;
    // setCurrentValue(value[outputValue] || value); // set nested value or value
    // onChange(newValue[outputValue] || newValue);
    if (onChange) {
      if (newValue) onChange(newValue);
    }
    if (newValue === 'redirectURL' && withRedirect) {
      navigate(urlToRedirect);
    }
  };

  const handleOnSelect = (selectedValue: string): void => {
    setCurrentValue(selectedValue); // set nested value or value
  };

  const [, cancel] = useDebounce(
    () => {
      //  setState("Typing stopped");
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const asyncSearch = async (options: { q: string; fields: string }): Promise<{ result: unknown; success: boolean }> => {
    // @ts-ignore - request.search typing from external module
    return await request.search({ entity, options });
  };

  const { onFetch, result, isSuccess, isLoading } = useOnFetch<(OptionField | string)[]>();

  const labels = (optionField: OptionField | string): string => {
    if (typeof optionField === 'string') return optionField;
    return displayLabels.map((x: string) => optionField[x]).join(' ');
  };

  useEffect(() => {
    const options = {
      q: debouncedValue,
      fields: searchFields,
    };
    const callback = asyncSearch(options);
    // @ts-ignore - onFetch expects matching generic but asyncSearch returns broader type
    onFetch(callback);

    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText: string): void => {
    isSearching.current = true;
    setSearching(true);
    // setOptions([]);
    // setCurrentValue(undefined);
    setValToSearch(searchText);
  };

  useEffect(() => {
    if (isSuccess) {
      setOptions(result ?? []);
    } else {
      setSearching(false);
      // setCurrentValue(undefined);
      // setOptions([]);
    }
  }, [isSuccess, result]);
  useEffect(() => {
    // this for update Form , it's for setField
    if (value && isUpdating.current) {
      setOptions([value]);
      const resolvedValue: string = typeof value === 'string' ? value : (value[outputValue] || '');
      setCurrentValue(resolvedValue);
      if (onChange) {
        onChange(resolvedValue);
      }
      isUpdating.current = false;
    }
  }, [value]);

  const getOptionKey = (optionField: OptionField | string): string => {
    if (typeof optionField === 'string') return optionField;
    return optionField[outputValue] || '';
  };

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={translate('Search')}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={searching ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      onClear={() => {
        // setOptions([]);
        // setCurrentValue(undefined);
        setSearching(false);
      }}
      onChange={handleSelectChange}
      style={{ minWidth: '220px' }}
      // onSelect={handleOnSelect}
    >
      {selectOptions.map((optionField: OptionField | string) => (
        <Select.Option
          key={getOptionKey(optionField)}
          value={getOptionKey(optionField)}
        >
          {labels(optionField)}
        </Select.Option>
      ))}
      {withRedirect && <Select.Option value={addNewValue.value}>{addNewValue.label}</Select.Option>}
    </Select>
  );
}
