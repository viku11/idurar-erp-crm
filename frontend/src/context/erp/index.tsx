import React, { useMemo, useReducer, createContext, useContext } from 'react';
import { initialState, contextReducer } from './reducer';
import type { ErpContextState } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

type ErpContextValue = [ErpContextState, React.Dispatch<React.ReducerAction<typeof contextReducer>>];

const ErpContext = createContext<ErpContextValue | undefined>(undefined);

interface ErpContextProviderProps {
  children: React.ReactNode;
}

function ErpContextProvider({ children }: ErpContextProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value: ErpContextValue = useMemo(() => [state, dispatch], [state]);

  return <ErpContext.Provider value={value}>{children}</ErpContext.Provider>;
}

interface UseErpContextReturn {
  state: ErpContextState;
  erpContextAction: ReturnType<typeof contextActions>;
  erpContextSelector: ReturnType<typeof contextSelectors>;
}

function useErpContext(): UseErpContextReturn {
  const context = useContext(ErpContext);
  if (context === undefined) {
    throw new Error('useErpContext must be used within a ErpContextProvider');
  }
  const [state, dispatch] = context;
  const erpContextAction = contextActions(dispatch);
  // @ts-ignore - selectors defines its own ErpContextState that differs from reducer's
  const erpContextSelector = contextSelectors(state);
  return { state, erpContextAction, erpContextSelector };
}

export { ErpContextProvider, useErpContext };
