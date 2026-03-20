import { useEffect, useState, useRef } from 'react';

import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import { selectSearchedItems } from '@/redux/erp/selectors';

import { Empty } from 'antd';

interface SearchConfig {
  displayLabels: string[];
  searchFields: string[];
  outputValue?: string;
}

interface SearchProps {
  config: {
    entity: string;
    searchConfig: SearchConfig;
  };
}

interface SearchState {
  result: Record<string, string>[];
  isLoading: boolean;
  isSuccess: boolean;
}

interface OptionItem {
  label: string;
  value?: string;
}

export default function Search({ config }: SearchProps) {
  let { entity, searchConfig } = config;

  const { displayLabels, searchFields, outputValue = '_id' } = searchConfig;
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<OptionItem[]>([]);

  const { erpContextAction } = useErpContext() as unknown as {
    erpContextAction: {
      panel: { open: () => void; close: () => void };
      collapsedBox: { open: () => void; close: () => void };
      readBox: { open: () => void; close: () => void };
    };
  };
  const { panel, collapsedBox, readBox } = erpContextAction;

  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems) as SearchState;

  const isTyping = useRef(false);

  let delayTimer: ReturnType<typeof setTimeout> | null = null;
  useEffect(() => {
    isLoading && setOptions([{ label: '... Searching' }]);
  }, [isLoading]);
  const onSearch = (searchText: string) => {
    isTyping.current = true;

    clearTimeout(delayTimer as ReturnType<typeof setTimeout>);
    delayTimer = setTimeout(function () {
      if (isTyping.current && searchText !== '') {
        dispatch(
          (erp.search as Function)(entity, {
            question: searchText,
            fields: searchFields,
          })
        );
      }
      isTyping.current = false;
    }, 500);
  };

  const onSelect = (data: string) => {
    const currentItem = result.find((item) => {
      return item[outputValue] === data;
    });

    dispatch(erp.currentItem({ data: currentItem }) as never);
    panel.open();
    collapsedBox.open();
    readBox.open();
  };

  const onChange = (data: string) => {
    const currentItem = options.find((item: OptionItem) => {
      return item.value === data;
    });
    const currentValue = currentItem ? currentItem.label : data;
    setValue(currentValue);
  };

  useEffect(() => {
    let optionResults: OptionItem[] = [];

    result.map((item: Record<string, string>) => {
      const labels = displayLabels.map((x) => item[x]).join(' ');
      optionResults.push({ label: labels, value: item[outputValue] });
    });

    setOptions(optionResults);
  }, [result]);

  return (
    <AutoComplete
      value={value}
      options={options}
      style={{
        width: '100%',
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={onChange}
      notFoundContent={!isSuccess ? <Empty /> : ''}
      allowClear={true}
      placeholder="Your Search here"
    >
      <Input suffix={<SearchOutlined />} />
    </AutoComplete>
  );
}
