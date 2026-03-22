import { createSelector } from 'reselect';

interface Pagination {
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}

interface ErpItem {
  _id: string;
  [key: string]: unknown;
}

interface ListResult {
  items: ErpItem[];
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

interface CrudState {
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

interface ErpState {
  current: CurrentState;
  list: ListState;
  create: CrudState;
  update: CrudState;
  delete: CrudState;
  read: CrudState;
  recordPayment: CrudState;
  search: SearchState;
  summary: CrudState;
  mail: CrudState;
}

interface RootState {
  erp: ErpState;
}

const selectErp = (state: RootState): ErpState => state.erp;

export const selectCurrentItem = createSelector([selectErp], (erp: ErpState) => erp.current);

export const selectListItems = createSelector([selectErp], (erp: ErpState) => erp.list);
export const selectItemById = (itemId: string) =>
  createSelector(selectListItems, (list: ListState) => list.result.items.find((item: ErpItem) => item._id === itemId));

export const selectCreatedItem = createSelector([selectErp], (erp: ErpState) => erp.create);

export const selectUpdatedItem = createSelector([selectErp], (erp: ErpState) => erp.update);

export const selectRecordPaymentItem = createSelector([selectErp], (erp: ErpState) => erp.recordPayment);

export const selectReadItem = createSelector([selectErp], (erp: ErpState) => erp.read);

export const selectDeletedItem = createSelector([selectErp], (erp: ErpState) => erp.delete);

export const selectSearchedItems = createSelector([selectErp], (erp: ErpState) => erp.search);
export const selectMailItem = createSelector([selectErp], (erp: ErpState) => erp.mail);
