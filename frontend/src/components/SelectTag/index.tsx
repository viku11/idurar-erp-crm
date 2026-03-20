import { Select, Tag } from 'antd';
// @ts-ignore: shortid lacks type declarations
import { generate as uniqueId } from 'shortid';

interface SelectTagProps {
  options?: string[];
  defaultValue?: string;
}

declare const option: { value: string; label: string };
declare function translate(label: string): string;

export default function SelectTag({ options, defaultValue }: SelectTagProps): JSX.Element {
  return (
    <Select
      defaultValue={defaultValue}
      style={{
        width: '100%',
      }}
    >
      {options?.map((value: string) => {
        if (option)
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value}>
              {translate(option.label)}
            </Select.Option>
          );
        else
          return (
            <Select.Option key={`${uniqueId()}`} value={value}>
              {value}
            </Select.Option>
          );
      })}
    </Select>
  );
}
