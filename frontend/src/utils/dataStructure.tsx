import React from 'react';
import dayjs from 'dayjs';
import { Switch, Tag } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { countryList } from '@/utils/countryList';
// @ts-ignore - shortid has no declaration file
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';

interface FieldOption {
  value: string;
  color?: string;
  label?: string;
}

interface Field {
  label?: string;
  dataIndex?: string[];
  type: string;
  color?: string;
  disableForTable?: boolean;
  renderAsTag?: boolean;
  options: FieldOption[];
  colors: Record<string, string>;
}

interface ReadColumn {
  title: string;
  dataIndex: string;
  isDate: boolean;
}

interface DataForReadParams {
  fields: Record<string, Field>;
  translate: (key: string) => string;
}

interface DataForTableParams {
  fields: Record<string, Field>;
  translate: (key: string) => string;
  moneyFormatter: (args: { amount: number; currency_code: string }) => string;
  dateFormat: string;
}

interface TableRecord extends Record<string, unknown> {
  currency: string;
  color?: string;
}

interface TableColumn {
  title: string;
  dataIndex: string[];
  onCell?: () => Record<string, unknown>;
  render?: (_text: unknown, record: TableRecord) => React.ReactNode;
}

export const dataForRead = ({ fields }: DataForReadParams): ReadColumn[] => {
  const columns: ReadColumn[] = [];

  Object.keys(fields).forEach((key) => {
    const field: Field = fields[key];
    columns.push({
      title: field.label ? field.label : key,
      dataIndex: field.dataIndex ? field.dataIndex.join('.') : key,
      isDate: field.type === 'date',
    });
  });

  return columns;
};

export function dataForTable({ fields, translate, moneyFormatter, dateFormat }: DataForTableParams): TableColumn[] {
  const columns: TableColumn[] = [];

  Object.keys(fields).forEach((key) => {
    const field: Field = fields[key];
    const keyIndex: string[] = field.dataIndex ? field.dataIndex : [key];

    const component: Record<string, TableColumn> = {
      boolean: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        onCell: () => ({
          props: {
            style: {
              width: '60px',
            },
          },
        }),
        render: (_: unknown, record: TableRecord) => (
          <Switch
            checked={record[key] as boolean}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        ),
      },
      date: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_: unknown, record: TableRecord) => {
          const date: string = dayjs(record[key] as string).format(dateFormat);
          return (
            <Tag bordered={false} color={field.color}>
              {date}
            </Tag>
          );
        },
      },
      currency: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        onCell: () => {
          return {
            style: {
              textAlign: 'right',
              whiteSpace: 'nowrap',
            },
          };
        },
        render: (_: unknown, record: TableRecord) =>
          moneyFormatter({ amount: record[key] as number, currency_code: record.currency }),
      },
      async: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text: unknown, record: TableRecord) => {
          const recordValue = record[key] as { color?: string } | undefined;
          return (
            <Tag bordered={false} color={field.color || recordValue?.color || record.color}>
              {text as React.ReactNode}
            </Tag>
          );
        },
      },
      color: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text: unknown) => {
          return (
            <Tag bordered={false} color={text as string}>
              {color.find((x) => x.value === text)?.label}
            </Tag>
          );
        },
      },
      stringWithColor: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text: unknown, record: TableRecord) => {
          return (
            <Tag bordered={false} color={record.color || field.color}>
              {text as React.ReactNode}
            </Tag>
          );
        },
      },
      tag: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_: unknown, record: TableRecord) => {
          return (
            <Tag bordered={false} color={field.color}>
              {record[key] as React.ReactNode}
            </Tag>
          );
        },
      },
      selectWithFeedback: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_text: unknown, record: TableRecord) => {
          if (field.renderAsTag) {
            const selectedOption: FieldOption | undefined = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] ? translate(record[key] as string) : null}
              </Tag>
            );
          } else return (record[key] ? translate(record[key] as string) : null) as React.ReactNode;
        },
      },
      select: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_: unknown, record: TableRecord) => {
          if (field.renderAsTag) {
            const selectedOption: FieldOption | undefined = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] as React.ReactNode}
              </Tag>
            );
          } else return record[key] as React.ReactNode;
        },
      },
      selectWithTranslation: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_: unknown, record: TableRecord) => {
          if (field.renderAsTag) {
            const selectedOption: FieldOption | undefined = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] ? translate(record[key] as string) : null}
              </Tag>
            );
          } else return (record[key] ? translate(record[key] as string) : null) as React.ReactNode;
        },
      },
      array: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_: unknown, record: TableRecord) => {
          return (record[key] as string[]).map((x: string) => (
            <Tag bordered={false} key={`${uniqueId()}`} color={field.colors[x]}>
              {x}
            </Tag>
          ));
        },
      },
      country: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_: unknown, record: TableRecord) => {
          const selectedCountry = countryList.find((obj) => obj.value === record[key]);

          return (
            <Tag bordered={false} color={field.color || undefined}>
              {/* @ts-ignore - icon may exist on extended country objects at runtime */}
              {selectedCountry && (selectedCountry as Record<string, unknown>).icon ? String((selectedCountry as Record<string, unknown>).icon) + ' ' : null}
              {selectedCountry?.label && translate(selectedCountry.label)}
            </Tag>
          );
        },
      },
    };

    const defaultComponent: TableColumn = {
      title: field.label ? translate(field.label) : translate(key),
      dataIndex: keyIndex,
    };

    const type: string = field.type;

    if (!field.disableForTable) {
      Object.keys(component).includes(type)
        ? columns.push(component[type])
        : columns.push(defaultComponent);
    }
  });

  return columns;
}

function getRandomColor(): string {
  const colors: string[] = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  const randomIndex: number = Math.floor(Math.random() * colors.length);

  return colors[randomIndex];
}
