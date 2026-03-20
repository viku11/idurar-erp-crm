import { useState, useEffect, useRef } from 'react';

import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import useDebounce from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

import { Select, Empty } from 'antd';
import useLanguage from '@/locale/useLanguage';

interface OptionRecord {
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
  value?: OptionRecord | string; /// this is for update
  onChange?: (value: string) => void; /// this is for update
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
}: AutoCompleteAsyncProps): JSX.Element {
  const translate = useLanguage();

  const addNewValue = { value: 'redirectURL', label: `+ ${translate(redirectLabel)}` };

  const [selectOptions, setOptions] = useState<OptionRecord[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

  const isUpdating = useRef<boolean>(true);
  const isSearching = useRef<boolean>(false);

  const [searching, setSearching] = useState<boolean>(false);

  const [valToSearch, setValToSearch] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>('');

  const navigate = useNavigate();

  const handleSelectChange = (newValue: string): void => {
    isUpdating.current = false;
    // setCurrentValue(value[outputValue] || value); // set nested value or value
    // onChange(newValue[outputValue] || newValue);
    if (onChange) {
      if (newValue) onChange((newValue as unknown as OptionRecord)[outputValue] || newValue);
    }
    if (newValue === 'redirectURL' && withRedirect) {
      navigate(urlToRedirect);
    }
  };

  const handleOnSelect = (value: string): void => {
    setCurrentValue((value as unknown as OptionRecord)[outputValue] || value); // set nested value or value
  };

  const [, cancel] = useDebounce(
    () => {
      //  setState("Typing stopped");
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const asyncSearch = async (options: { q: string; fields: string }): Promise<unknown> => {
    return await request.search({ entity, options });
  };

  let { onFetch, result, isSuccess, isLoading } = useOnFetch();

  const labels = (optionField: OptionRecord): string => {
    return displayLabels.map((x: string) => optionField[x]).join(' ');
  };

  useEffect(() => {
    const options = {
      q: debouncedValue,
      fields: searchFields,
    };
    const callback = asyncSearch(options);
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
      setOptions(result as unknown as OptionRecord[]);
    } else {
      setSearching(false);
      // setCurrentValue(undefined);
      // setOptions([]);
    }
  }, [isSuccess, result]);
  useEffect(() => {
    // this for update Form , it's for setField
    if (value && isUpdating.current) {
      setOptions([value as OptionRecord]);
      setCurrentValue((value as OptionRecord)[outputValue] || (value as string)); // set nested value or value
      onChange!((value as OptionRecord)[outputValue] || (value as string));
      isUpdating.current = false;
    }
  }, [value]);

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
      {selectOptions.map((optionField: OptionRecord) => (
        <Select.Option
          key={optionField[outputValue] || (optionField as unknown as string)}
          value={optionField[outputValue] || (optionField as unknown as string)}
        >
          {labels(optionField)}
        </Select.Option>
      ))}
      {withRedirect && <Select.Option value={addNewValue.value}>{addNewValue.label}</Select.Option>}
    </Select>
  );
}
