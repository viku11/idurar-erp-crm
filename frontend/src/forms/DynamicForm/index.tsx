import { useState } from 'react';
import { DatePicker, Input, Form, Select, InputNumber, Switch, Tag } from 'antd';
import type { Rule } from 'antd/es/form';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
// @ts-ignore — AutoCompleteAsync may not export types
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
// @ts-ignore — SelectAsync may not export types
import SelectAsync from '@/components/SelectAsync';
// @ts-ignore — shortid has no type declarations
import { generate as uniqueId } from 'shortid';

import { countryList } from '@/utils/countryList';

interface FieldOption {
  value: string;
  label: string;
  color?: string;
}

type FieldType =
  | 'string'
  | 'url'
  | 'textarea'
  | 'email'
  | 'number'
  | 'phone'
  | 'boolean'
  | 'date'
  | 'async'
  | 'currency'
  | 'select'
  | 'selectWithTranslation'
  | 'selectWithFeedback'
  | 'color'
  | 'tag'
  | 'array'
  | 'country'
  | 'search';

interface Field {
  type: FieldType;
  name?: string;
  label?: string;
  required?: boolean;
  defaultValue?: string | string[] | boolean;
  options?: FieldOption[];
  showSearch?: boolean;
  hasFeedback?: boolean;
  feedback?: string;
  disableForForm?: boolean;
  disableForUpdate?: boolean;
  maxLength?: number;
  entity?: string;
  displayLabels?: string[];
  searchFields?: string;
  outputValue?: string;
  withRedirect?: boolean;
  urlToRedirect?: string;
  redirectLabel?: string;
  loadDefault?: boolean;
}

type Fields = Record<string, Field>;

interface DynamicFormProps {
  fields: Fields;
  isUpdateForm?: boolean;
}

export default function DynamicForm({ fields, isUpdateForm = false }: DynamicFormProps): JSX.Element {
  const [feedback, setFeedback] = useState<string | undefined>();

  return (
    <div>
      {Object.keys(fields).map((key) => {
        let field = fields[key];

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
  setFeedback?: (value: string) => void;
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

  const buildRule = (): Rule => {
    const ruleType = filedType[field.type] ?? 'any';
    return {
      required: field.required || false,
      type: ruleType,
    } as Rule;
  };

  const SelectComponent = (): JSX.Element => (
    <Form.Item
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
    >
      <Select
        showSearch={field.showSearch}
        defaultValue={field.defaultValue as string | undefined}
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
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
    >
      <Select
        defaultValue={field.defaultValue as string | undefined}
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

  interface SelectWithFeedbackProps {
    feedbackValue: string | undefined;
    lanchFeedback: (value: string) => void;
  }

  const SelectWithFeedbackComponent = ({ feedbackValue, lanchFeedback }: SelectWithFeedbackProps): JSX.Element => (
    <Form.Item
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
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
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
    >
      <Select
        showSearch
        defaultValue={field.defaultValue as string | undefined}
        filterOption={(input: string, option: { label?: string } | undefined) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA: { label?: string }, optionB: { label?: string }) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
            ? -1
            : 1
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
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
    >
      <Select
        defaultValue={field.defaultValue as string | undefined}
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
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
    >
      <Select
        mode={'multiple'}
        defaultValue={field.defaultValue as string[] | undefined}
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
      label={translate(field.label!)}
      name={field.name}
      rules={[buildRule()]}
    >
      <Select
        showSearch
        defaultValue={field.defaultValue as string | undefined}
        optionFilterProp="children"
        filterOption={(input: string, option: { label?: string } | undefined) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA: { label?: string }, optionB: { label?: string }) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
            ? -1
            : 1
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
            {translate(language.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const SearchComponent = (): JSX.Element => {
    return (
      <Form.Item
        label={translate(field.label!)}
        name={field.name}
        rules={[buildRule()]}
      >
        <AutoCompleteAsync
          entity={field.entity!}
          displayLabels={field.displayLabels!}
          searchFields={field.searchFields!}
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
      <Input autoComplete="off" maxLength={field.maxLength} defaultValue={field.defaultValue as string | undefined} />
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
      // @ts-ignore — onChange is injected by Form.Item at runtime
      <SelectAsync
        entity={field.entity!}
        displayLabels={field.displayLabels!}
        outputValue={field.outputValue}
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

  const customFormItem: JSX.Element | undefined = formItemComponent[field.type];
  let renderComponent: JSX.Element | undefined = compunedComponent[field.type];

  if (!renderComponent) {
    renderComponent = compunedComponent['string'];
  }

  if (customFormItem) return <>{customFormItem}</>;
  else {
    return (
      <Form.Item
        label={translate(field.label!)}
        name={field.name}
        rules={[buildRule()]}
        valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
      >
        {renderComponent}
      </Form.Item>
    );
  }
}
