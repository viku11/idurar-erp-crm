import React, { useState } from 'react';
import { DatePicker, Input, Form, Select, InputNumber, Switch, Tag } from 'antd';
import type { Rule } from 'antd/es/form';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SelectAsync from '@/components/SelectAsync';
// @ts-expect-error shortid has no type declarations
import { generate as uniqueId } from 'shortid';

import { countryList } from '@/utils/countryList';

interface FieldOption {
  value: string;
  label: string;
  color?: string;
}

interface Field {
  type: string;
  name?: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  showSearch?: boolean;
  maxLength?: number;
  options?: FieldOption[];
  hasFeedback?: boolean;
  feedback?: string;
  disableForUpdate?: boolean;
  disableForForm?: boolean;
  entity?: string;
  displayLabels?: string[];
  searchFields?: string;
  outputValue?: string;
  withRedirect?: boolean;
  urlToRedirect?: string;
  redirectLabel?: string;
  loadDefault?: boolean;
}

interface DynamicFormProps {
  fields: Record<string, Field>;
  isUpdateForm?: boolean;
}

export default function DynamicForm({ fields, isUpdateForm = false }: DynamicFormProps): JSX.Element {
  const [feedback, setFeedback] = useState<string | undefined>();

  return (
    <div>
      {Object.keys(fields).map((key) => {
        const field = fields[key];

        if ((isUpdateForm && !field.disableForUpdate) || !field.disableForForm) {
          field.name = key;
          if (!field.label) field.label = key;
          if (field.hasFeedback)
            return (
              <FormElement feedback={feedback} setFeedback={setFeedback} key={key} field={field} />
            );
          else if (feedback && field.feedback) {
            if (feedback == field.feedback) return <FormElement key={key} field={field} />;
          } else {
            return <FormElement key={key} field={field} />;
          }
        }
      })}
    </div>
  );
}

interface FormElementProps {
  field: Field;
  feedback?: string;
  setFeedback?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface SelectWithFeedbackComponentProps {
  feedbackValue: string | undefined;
  lanchFeedback: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function FormElement({ field, feedback, setFeedback }: FormElementProps): JSX.Element {
  const translate = useLanguage();
  const money = useMoney();
  const { dateFormat } = useDate();

  const { TextArea } = Input;

  const filedType: Record<string, string> = {
    string: 'string',
    textarea: 'string',
    number: 'number',
    phone: 'string',
    //boolean: 'boolean',
    // method: 'method',
    // regexp: 'regexp',
    // integer: 'integer',
    // float: 'float',
    // array: 'array',
    // object: 'object',
    // enum: 'enum',
    // date: 'date',
    url: 'url',
    website: 'url',
    email: 'email',
  };

  const getFieldRules = (): Rule[] => [
    {
      required: field.required || false,
      type: filedType[field.type] as Rule extends { type?: infer T } ? T : never ?? 'any',
    } as Rule,
  ];

  const SelectComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        showSearch={field.showSearch}
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value}>
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const SelectWithTranslationComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value}>
              <Tag bordered={false} color={option.color}>
                {translate(option.label)}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const SelectWithFeedbackComponent = ({ feedbackValue, lanchFeedback }: SelectWithFeedbackComponentProps): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        onSelect={(value: string) => lanchFeedback(value)}
        value={feedbackValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            {translate(option.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const ColorComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        showSearch
        defaultValue={field.defaultValue}
        filterOption={(input, option) =>
          ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          ((optionA?.label as string) ?? '').toLowerCase().startsWith(((optionB?.label as string) ?? '').toLowerCase()) ? -1 : 1
        }
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value} label={option.label}>
              <Tag bordered={false} color={option.color}>
                {option.label}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const TagComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            <Tag bordered={false} color={option.color}>
              {translate(option.label)}
            </Tag>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const ArrayComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        mode={'multiple'}
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const CountryComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label as string)}
      name={field.name}
      rules={getFieldRules()}
    >
      <Select
        showSearch
        defaultValue={field.defaultValue}
        optionFilterProp="children"
        filterOption={(input, option) =>
          ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          ((optionA?.label as string) ?? '').toLowerCase().startsWith(((optionB?.label as string) ?? '').toLowerCase()) ? -1 : 1
        }
        style={{
          width: '100%',
        }}
      >
        {countryList.map((language) => (
          <Select.Option
            key={language.value}
            value={language.value}
            label={translate(language.label)}
          >
            {(language as unknown as Record<string, string>)?.icon && (language as unknown as Record<string, string>)?.icon + ' '}
            {translate(language.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const SearchComponent = (): JSX.Element => {
    return (
      <Form.Item
        label={translate(field.label as string)}
        name={field.name}
        rules={getFieldRules()}
      >
        <AutoCompleteAsync
          entity={field.entity as string}
          displayLabels={field.displayLabels as string[]}
          searchFields={field.searchFields as string}
          outputValue={field.outputValue}
          withRedirect={field.withRedirect}
          urlToRedirect={field.urlToRedirect}
          redirectLabel={field.redirectLabel}
        ></AutoCompleteAsync>
      </Form.Item>
    );
  };

  const formItemComponent: Record<string, JSX.Element> = {
    select: <SelectComponent />,
    selectWithTranslation: <SelectWithTranslationComponent />,
    selectWithFeedback: (
      <SelectWithFeedbackComponent lanchFeedback={setFeedback!} feedbackValue={feedback} />
    ),
    color: <ColorComponent />,

    tag: <TagComponent />,
    array: <ArrayComponent />,
    country: <CountryComponent />,
    search: <SearchComponent />,
  };

  const compunedComponent: Record<string, JSX.Element> = {
    string: (
      <Input autoComplete="off" maxLength={field.maxLength} defaultValue={field.defaultValue} />
    ),
    url: <Input addonBefore="http://" autoComplete="off" placeholder="www.example.com" />,
    textarea: <TextArea rows={4} />,
    email: <Input autoComplete="off" placeholder="email@example.com" />,
    number: <InputNumber style={{ width: '100%' }} />,
    phone: <Input style={{ width: '100%' }} placeholder="+1 123 456 789" />,
    boolean: (
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        defaultValue={true}
      />
    ),
    date: (
      <DatePicker
        placeholder={translate('select_date')}
        style={{ width: '100%' }}
        format={dateFormat}
      />
    ),
    async: (
      <SelectAsync
        entity={field.entity as string}
        displayLabels={field.displayLabels}
        outputValue={field.outputValue}
        onChange={() => {}}
        withRedirect={field.withRedirect}
        urlToRedirect={field.urlToRedirect}
        redirectLabel={field.redirectLabel}
      ></SelectAsync>
    ),

    currency: (
      <InputNumber
        className="moneyInput"
        min={0}
        controls={false}
        addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
        addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
      />
    ),
  };

  const customFormItem = formItemComponent[field.type];
  let renderComponent = compunedComponent[field.type];

  if (!renderComponent) {
    renderComponent = compunedComponent['string'];
  }

  if (customFormItem) return <>{customFormItem}</>;
  else {
    return (
      <Form.Item
        label={translate(field.label as string)}
        name={field.name}
        rules={getFieldRules()}
        valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
      >
        {renderComponent}
      </Form.Item>
    );
  }
}
