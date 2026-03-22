import { createSelector } from 'reselect';

interface Pagination {
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}

interface ListResult {
  items: Array<{ _id: string; [key: string]: unknown }>;
  pagination: Pagination;
}

interface ListState {
  result: ListResult;
  isLoading: boolean;
  isSuccess: boolean;
}

interface CurrentState {
  result: unknown;
}

interface CrudOperationState {
  result: unknown;
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface SearchState {
  result: unknown[];
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface AdavancedCrudState {
  current: CurrentState;
  list: ListState;
  create: CrudOperationState;
  update: CrudOperationState;
  delete: CrudOperationState;
  read: CrudOperationState;
  createInvoice: CrudOperationState;
  search: SearchState;
  summary: CrudOperationState;
  mail: CrudOperationState;
}

interface RootState {
  adavancedCrud: AdavancedCrudState;
}

const selectAdavancedCrud = (state: RootState): AdavancedCrudState => state.adavancedCrud;

export const selectCurrentItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): CurrentState => adavancedCrud.current
);

export const selectListItems = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): ListState => adavancedCrud.list
);
export const selectItemById = (itemId: string) =>
  createSelector(selectListItems, (list: ListState) => list.result.items.find((item) => item._id === itemId));

export const selectCreatedItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): CrudOperationState => adavancedCrud.create
);

export const selectUpdatedItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): CrudOperationState => adavancedCrud.update
);

export const selectReadItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): CrudOperationState => adavancedCrud.read
);

export const selectDeletedItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): CrudOperationState => adavancedCrud.delete
);

export const selectSearchedItems = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): SearchState => adavancedCrud.search
);
export const selectMailItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud: AdavancedCrudState): CrudOperationState => adavancedCrud.mail
);
