import { useState, useEffect } from 'react';
import { Select, Space } from 'antd';
import { request } from '@/request';
import errorHandler from '@/request/errorHandler';

import type { CSSProperties } from 'react';
import type { SelectProps } from 'antd';

const { Option } = Select;

interface ApiResponse {
  success: boolean;
  result: Record<string, unknown>[];
  message: string;
}

interface SelectionValue {
  firstSelectedOption?: Record<string, unknown>;
  secondSelectedOption?: Record<string, unknown>;
}

interface MultiStepSelectAsyncProps {
  firstSelectProps?: SelectProps;
  secondSelectProps?: SelectProps;
  firstSelectIdKey?: string;
  firstSelectValueKey?: string;
  firstSelectLabelKey?: string;
  secondSelectIdKey?: string;
  secondSelectValueKey?: string;
  secondSelectLabelKey?: string;
  entityName: string;
  subEntityName?: string;
  value?: SelectionValue;
  onChange?: (value: SelectionValue) => void;
  style?: CSSProperties;
}

const asyncList = (entity: string): Promise<ApiResponse> => {
  return request.list({ entity });
};

const asyncFilter = (entity: string, options: { filter: string; equal: unknown }): Promise<ApiResponse> => {
  return request.filter({ entity, options });
};

const MultiStepSelectAsync = ({
  firstSelectProps = {},
  secondSelectProps = {},
  firstSelectIdKey = '_id',
  firstSelectValueKey = 'value',
  firstSelectLabelKey = 'label',
  secondSelectIdKey = '_id',
  secondSelectValueKey = 'value',
  secondSelectLabelKey = 'label',
  entityName,
  subEntityName = 'items',
  value = {},
  onChange,
  style,
}: MultiStepSelectAsyncProps): JSX.Element => {
  const firstSelectedOption = value.firstSelectedOption;
  const [firstSelectOptions, setFirstSelectOptions] = useState<Record<string, unknown>[]>([]);
  const [secondSelectOptions, setSecondSelectOptions] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (firstSelectedOption) {
          const data = await asyncFilter(entityName, {
            filter: '_id',
            equal: firstSelectedOption[firstSelectIdKey],
          });

          setSecondSelectOptions(
            (data?.result?.[0]?.[subEntityName] as Record<string, unknown>[]) ?? []
          );
          return;
        }
        const data = await asyncList(entityName);
        setFirstSelectOptions(data.result);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [firstSelectedOption]);

  return (
    <Space direction="vertical" style={style}>
      <Select
        placeholder="Select an option"
        style={{ width: 200 }}
        {...firstSelectProps}
        loading={!firstSelectedOption ? loading : false}
        onChange={(selectedValue: unknown) => {
          if (onChange) {
            onChange({
              firstSelectedOption: firstSelectOptions.find(
                (option) => option[firstSelectValueKey] === selectedValue
              ),
            });
          }
        }}
      >
        {firstSelectOptions.map((option) => (
          <Option
            key={option[firstSelectIdKey] as string}
            value={option[firstSelectValueKey] as string}
          >
            {option[firstSelectLabelKey] as string}
          </Option>
        ))}
      </Select>
      {firstSelectedOption && (
        <Select
          placeholder="Select another option"
          loading={loading}
          style={{ width: 200 }}
          {...secondSelectProps}
          onChange={(selectedValue: unknown) => {
            if (onChange) {
              onChange({
                firstSelectedOption,
                secondSelectedOption: secondSelectOptions.find(
                  (option) => option[secondSelectValueKey] === selectedValue
                ),
              });
            }
          }}
        >
          {secondSelectOptions.map((option) => (
            <Option
              key={option[secondSelectIdKey] as string}
              value={option[secondSelectValueKey] as string}
            >
              {option[secondSelectLabelKey] as string}
            </Option>
          ))}
        </Select>
      )}
    </Space>
  );
};

export default MultiStepSelectAsync;
