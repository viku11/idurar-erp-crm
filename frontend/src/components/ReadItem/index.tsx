import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';

import dayjs from 'dayjs';
import { dataForRead } from '@/utils/dataStructure';

import { useCrudContext } from '@/context/crud';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { valueByString } from '@/utils/helpers';

import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';

interface ReadColumn {
  title: string;
  dataIndex: string;
  isDate?: boolean;
}

interface Field {
  label?: string;
  dataIndex?: string[];
  type?: string;
}

interface ReadItemConfig {
  readColumns?: ReadColumn[];
  fields?: Record<string, Field>;
}

interface ReadItemProps {
  config: ReadItemConfig;
}

interface ListItem {
  propsKey: string;
  label: string;
  value: string;
}

export default function ReadItem({ config }: ReadItemProps): JSX.Element {
  const { dateFormat } = useDate();
  let { readColumns, fields } = config;
  const translate = useLanguage();
  const { result: currentResult } = useSelector(selectCurrentItem) as { result: Record<string, unknown> | null };
  const { state } = useCrudContext() as { state: { isReadBoxOpen: boolean }; crudContextAction: unknown; crudContextSelector: unknown };
  const { isReadBoxOpen } = state;
  const [listState, setListState] = useState<ListItem[]>([]);

  if (fields) readColumns = [...dataForRead({ fields: fields as any, translate: translate })] as ReadColumn[];
  useEffect(() => {
    const list: ListItem[] = [];
    (readColumns as ReadColumn[]).map((props: ReadColumn) => {
      const propsKey = props.dataIndex;
      const propsTitle = props.title;
      const isDate = props.isDate || false;
      let value: string = valueByString(currentResult ?? {}, propsKey) as string;
      value = isDate ? dayjs(value).format(dateFormat) : value;
      list.push({ propsKey, label: propsTitle, value: value });
    });
    setListState(list);
  }, [currentResult]);

  const show = isReadBoxOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };

  const itemsList = listState.map((item: ListItem) => {
    return (
      <Row key={item.propsKey} gutter={12}>
        <Col className="gutter-row" span={8}>
          <p>{item.label}</p>
        </Col>
        <Col className="gutter-row" span={2}>
          <p> : </p>
        </Col>
        <Col className="gutter-row" span={14}>
          <p>{item.value}</p>
        </Col>
      </Row>
    );
  });

  return <div style={show}>{itemsList}</div>;
}
