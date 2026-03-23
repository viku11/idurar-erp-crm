import React from 'react';

import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

interface SearchConfig {
  displayLabels: string[];
  searchFields: string;
}

interface Labels {
  PANEL_TITLE: string;
  DATATABLE_TITLE: string;
  ADD_NEW_ENTITY: string;
  ENTITY_NAME: string;
}

interface ConfigPage extends Labels {
  entity: string;
}

interface Config extends ConfigPage {
  fields: typeof fields;
  searchConfig: SearchConfig;
  deleteModalLabels: string[];
}

export default function Customer(): React.JSX.Element {
  const translate = useLanguage();
  const entity: string = 'client';
  const searchConfig: SearchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels: string[] = ['name'];

  const customerLabels: Labels = {
    PANEL_TITLE: translate('client'),
    DATATABLE_TITLE: translate('client_list'),
    ADD_NEW_ENTITY: translate('add_new_client'),
    ENTITY_NAME: translate('client'),
  };
  const configPage: ConfigPage = {
    entity,
    ...customerLabels,
  };
  const config: Config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      // @ts-ignore - fields type mismatch with DynamicForm props from external module
      createForm={<DynamicForm fields={fields} />}
      // @ts-ignore - fields type mismatch with DynamicForm props from external module
      updateForm={<DynamicForm fields={fields} />}
      config={config as unknown as React.ComponentProps<typeof CrudModule>['config']}
    />
  );
}
