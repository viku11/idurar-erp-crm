import { createSelector } from 'reselect';

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
}

interface CrudItem {
  _id: string;
  [key: string]: unknown;
}

interface KeyState {
  result: unknown;
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface ListState {
  result: {
    items: CrudItem[];
    pagination: Pagination;
  };
  isLoading: boolean;
  isSuccess: boolean;
}

interface CurrentState {
  result: unknown;
}

interface SearchState {
  result: unknown[];
  current: unknown;
  isLoading: boolean;
  isSuccess: boolean;
}

interface CrudState {
  current: CurrentState;
  list: ListState;
  create: KeyState;
  update: KeyState;
  delete: KeyState;
  read: KeyState;
  search: SearchState;
}

interface RootState {
  crud: CrudState;
}

const selectCrud = (state: RootState): CrudState => state.crud;

export const selectCurrentItem = createSelector([selectCrud], (crud) => crud.current);

export const selectListItems = createSelector([selectCrud], (crud) => crud.list);
export const selectItemById = (itemId: string) =>
  createSelector(selectListItems, (list) => list.result.items.find((item) => item._id === itemId));

export const selectCreatedItem = createSelector([selectCrud], (crud) => crud.create);

export const selectUpdatedItem = createSelector([selectCrud], (crud) => crud.update);

export const selectReadItem = createSelector([selectCrud], (crud) => crud.read);

export const selectDeletedItem = createSelector([selectCrud], (crud) => crud.delete);

export const selectSearchedItems = createSelector([selectCrud], (crud) => crud.search);
