import { useState, useEffect } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
// @ts-expect-error shortid has no type declarations
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';
import useLanguage from '@/locale/useLanguage';

interface OptionField {
  [key: string]: string | undefined;
  color?: string;
}

interface SelectAsyncProps {
  entity: string;
  displayLabels?: string[];
  outputValue?: string;
  redirectLabel?: string;
  withRedirect?: boolean;
  urlToRedirect?: string;
  placeholder?: string;
  value?: Record<string, string> | string;
  onChange: (value: string | Record<string, string>) => void;
}

interface OptionItem {
  value: string | OptionField;
  label: string;
  color: string | undefined;
}

const SelectAsync = ({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
  placeholder = 'select',
  value,
  onChange,
}: SelectAsyncProps): JSX.Element => {
  const translate = useLanguage();
  const [selectOptions, setOptions] = useState<OptionField[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  useEffect(() => {
    isSuccess && setOptions(result as unknown as OptionField[]);
  }, [isSuccess]);

  const labels = (optionField: OptionField): string => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };
  useEffect(() => {
    if (value !== undefined) {
      const val = (value as Record<string, string>)?.[outputValue] ?? value;
      setCurrentValue(val as string);
      onChange(val);
    }
  }, [value]);

  const handleSelectChange = (newValue: string): void => {
    if (newValue === 'redirectURL') {
      navigate(urlToRedirect);
    } else {
      const val = (newValue as unknown as Record<string, string>)?.[outputValue] ?? newValue;
      setCurrentValue(newValue);
      onChange(val);
    }
  };

  const optionsList = (): OptionItem[] => {
    const list: OptionItem[] = [];

    // if (selectOptions.length === 0 && withRedirect) {
    //   const value = 'redirectURL';
    //   const label = `+ ${translate(redirectLabel)}`;
    //   list.push({ value, label });
    // }
    selectOptions.map((optionField) => {
      const value = optionField[outputValue] ?? optionField;
      const label = labels(optionField);
      const currentColor = (optionField[outputValue] as unknown as OptionField)?.color ?? optionField?.color;
      const labelColor = color.find((x) => x.color === currentColor);
      list.push({ value, label, color: labelColor?.color });
    });

    return list;
  };

  return (
    <Select
      loading={fetchIsLoading}
      disabled={fetchIsLoading}
      value={currentValue}
      onChange={handleSelectChange}
      placeholder={placeholder}
    >
      {optionsList()?.map((option) => {
        return (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            <Tag bordered={false} color={option.color}>
              {option.label}
            </Tag>
          </Select.Option>
        );
      })}
      {withRedirect && (
        <Select.Option value={'redirectURL'}>{`+ ` + translate(redirectLabel)}</Select.Option>
      )}
    </Select>
  );
};

export default SelectAsync;
