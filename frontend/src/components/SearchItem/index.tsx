import { useState, useEffect, useRef } from 'react';

import useDebounce from '@/hooks/useDebounce';

import { Select, Empty } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';

import { useCrudContext } from '@/context/crud';
import { selectSearchedItems } from '@/redux/crud/selectors';

interface SearchConfig {
  displayLabels: string[];
  searchFields: string;
  outputValue?: string;
}

interface Config {
  entity: string;
  searchConfig: SearchConfig;
}

interface SearchItemComponentProps {
  config: Config;
  onRerender: () => void;
}

interface RecordItem {
  _id: string;
  [key: string]: string;
}

interface SearchState {
  result: RecordItem[];
  isLoading: boolean;
  isSuccess: boolean;
}

interface CrudContextActionBox {
  open: () => void;
  close: () => void;
  collapse?: () => void;
}

interface CrudContextAction {
  panel: CrudContextActionBox;
  collapsedBox: CrudContextActionBox;
  readBox: CrudContextActionBox;
  modal: CrudContextActionBox;
  advancedBox: CrudContextActionBox;
  editBox: CrudContextActionBox;
}

function SearchItemComponent({ config, onRerender }: SearchItemComponentProps): JSX.Element {
  let { entity, searchConfig } = config;

  const { displayLabels, searchFields, outputValue = '_id' } = searchConfig;

  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext() as { crudContextAction: CrudContextAction };
  const { panel, collapsedBox, readBox } = crudContextAction;
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems) as SearchState;

  const [selectOptions, setOptions] = useState<RecordItem[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

  const isSearching = useRef<boolean>(false);

  const [searching, setSearching] = useState<boolean>(false);

  const [valToSearch, setValToSearch] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>('');

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  ) as [unknown, () => void];

  const labels = (optionField: RecordItem): string => {
    return displayLabels.map((x: string) => optionField[x]).join(' ');
  };

  useEffect(() => {
    if (debouncedValue != '') {
      const options = {
        q: debouncedValue,
        fields: searchFields,
      };
      dispatch(crud.search({ entity, options }) as never);
    }
    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText: string): void => {
    if (searchText && searchText != '') {
      isSearching.current = true;
      setSearching(true);
      setOptions([]);
      setCurrentValue(undefined);
      setValToSearch(searchText);
    }
  };

  const onSelect = (data: string): void => {
    const currentItem = result.find((item: RecordItem) => {
      return item[outputValue] === data;
    });

    dispatch(crud.currentItem({ data: currentItem ?? {} as Record<string, unknown> }) as never);

    panel.open();
    collapsedBox.open();
    readBox.open();
    onRerender();
  };
  useEffect(() => {
    if (isSearching.current) {
      if (isSuccess) {
        setOptions(result);
      } else {
        setSearching(false);
        setCurrentValue(undefined);
        setOptions([]);
      }
    }
  }, [isSuccess, result]);

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={
        <SearchOutlined
          style={{ float: 'right', padding: '8px 0' }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      }
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={searching ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      style={{ width: '100%' }}
      onSelect={onSelect}
    >
      {selectOptions.map((optionField: RecordItem) => (
        <Select.Option key={optionField[outputValue]} value={optionField[outputValue]}>
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}

interface SearchItemProps {
  config: Config;
}

export default function SearchItem({ config }: SearchItemProps): JSX.Element {
  const [state, setState] = useState<number[]>([0]);

  const onRerender = (): void => {
    setState([(state as unknown as number) + 1]);
  };

  return state.map((comp: number) => (
    <SearchItemComponent key={comp} config={config} onRerender={onRerender} />
  )) as unknown as JSX.Element;
}
