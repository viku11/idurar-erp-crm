import React, { useLayoutEffect, useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import CreateForm from '@/components/CreateForm';
import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';
import ReadItem from '@/components/ReadItem';
import SearchItem from '@/components/SearchItem';
import DataTable from '@/components/DataTable/DataTable';

import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentItem } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';

import { CrudLayout } from '@/layout';

interface SearchConfig {
  displayLabels: string[];
  searchFields: string;
}

interface FieldDefinition {
  label?: string;
  dataIndex?: string[];
  type?: string;
  disableForTable?: boolean;
  color?: string;
  colors?: Record<string, string>;
  renderAsTag?: boolean;
  options?: Array<{ value: string; color?: string; label?: string }>;
}

interface ReadColumn {
  title: string;
  dataIndex: string;
  isDate?: boolean;
}

interface CrudConfig {
  entity: string;
  fields?: Record<string, FieldDefinition>;
  searchConfig: SearchConfig;
  deleteModalLabels: string[];
  readColumns?: ReadColumn[];
  dataTableColumns?: Record<string, unknown>[];
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
}

interface SidePanelTopContentProps {
  config: CrudConfig;
  formElements: React.ReactNode;
  withUpload: boolean;
}

interface FixHeaderPanelProps {
  config: CrudConfig;
}

interface CrudModuleProps {
  config: CrudConfig;
  createForm: React.ReactNode;
  updateForm: React.ReactNode;
  withUpload?: boolean;
}

function SidePanelTopContent({ config, formElements, withUpload }: SidePanelTopContentProps): React.JSX.Element {
  const translate = useLanguage();
  const { crudContextAction, state } = useCrudContext() as {
    crudContextAction: {
      modal: { open: () => void; close: () => void };
      editBox: { open: () => void; close: () => void };
      collapsedBox: { open: () => void; close: () => void; collapse: () => void };
    };
    state: {
      isReadBoxOpen: boolean;
      isEditBoxOpen: boolean;
    };
  };
  const { deleteModalLabels } = config;
  const { modal, editBox } = crudContextAction;

  const { isReadBoxOpen, isEditBoxOpen } = state;
  const { result: currentItem } = useSelector(selectCurrentItem) as {
    result: Record<string, string> | null;
  };
  const dispatch = useDispatch();

  const [labels, setLabels] = useState('');
  useEffect(() => {
    if (currentItem) {
      const currentlabels = deleteModalLabels.map((x: string) => currentItem[x]).join(' ');

      setLabels(currentlabels);
    }
  }, [currentItem]);

  const removeItem = (): void => {
    dispatch(crud.currentAction({ actionType: 'delete', data: currentItem ?? {} as Record<string, unknown> }) as never);
    modal.open();
  };
  const editItem = (): void => {
    dispatch(crud.currentAction({ actionType: 'update', data: currentItem ?? {} as Record<string, unknown> }) as never);
    editBox.open();
  };

  const show = isReadBoxOpen || isEditBoxOpen ? { opacity: 1 } : { opacity: 0 };
  return (
    <>
      <Row style={show} gutter={24 as number}>
        <Col span={10}>
          <p style={{ marginBottom: '10px' }}>{labels}</p>
        </Col>
        <Col span={14}>
          <Button
            onClick={removeItem}
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            style={{ float: 'right', marginLeft: '5px', marginTop: '10px' }}
          >
            {translate('remove')}
          </Button>
          <Button
            onClick={editItem}
            type="text"
            icon={<EditOutlined />}
            size="small"
            style={{ float: 'right', marginLeft: '0px', marginTop: '10px' }}
          >
            {translate('edit')}
          </Button>
        </Col>

        <Col span={24}>
          <div className="line"></div>
        </Col>
        <div className="space10"></div>
      </Row>
      <ReadItem config={config} />
      <UpdateForm config={config} formElements={formElements} withUpload={withUpload} />
    </>
  );
}

function FixHeaderPanel({ config }: FixHeaderPanelProps): React.JSX.Element {
  const { crudContextAction } = useCrudContext() as {
    crudContextAction: {
      collapsedBox: { open: () => void; close: () => void; collapse: () => void };
    };
  };

  const { collapsedBox } = crudContextAction;

  const addNewItem = (): void => {
    collapsedBox.close();
  };

  return (
    <Row gutter={8}>
      <Col className="gutter-row" span={21}>
        <SearchItem config={config} />
      </Col>
      <Col className="gutter-row" span={3}>
        <Button onClick={addNewItem} block={true} icon={<PlusOutlined />}></Button>
      </Col>
    </Row>
  );
}

function CrudModule({ config, createForm, updateForm, withUpload = false }: CrudModuleProps): React.JSX.Element {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState() as never);
  }, []);

  return (
    <CrudLayout
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelBottomContent={
        <CreateForm config={config} formElements={createForm} withUpload={withUpload} />
      }
      sidePanelTopContent={
        <SidePanelTopContent config={config} formElements={updateForm} withUpload={withUpload} />
      }
    >
      <DataTable config={config as React.ComponentProps<typeof DataTable>['config']} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default CrudModule;
