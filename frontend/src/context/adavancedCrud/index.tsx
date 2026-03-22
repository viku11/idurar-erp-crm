import React, { useMemo, useReducer, createContext, useContext, ReactNode, Dispatch } from 'react';
import { initialState, contextReducer, AdvancedCrudState } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

type AdvancedCrudAction = Parameters<typeof contextReducer>[1];

type AdavancedCrudContextValue = [AdvancedCrudState, Dispatch<AdvancedCrudAction>];

const AdavancedCrudContext = createContext<AdavancedCrudContextValue | undefined>(undefined);

interface AdavancedCrudContextProviderProps {
  children: ReactNode;
}

function AdavancedCrudContextProvider({ children }: AdavancedCrudContextProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value: AdavancedCrudContextValue = useMemo(() => [state, dispatch], [state]);

  return <AdavancedCrudContext.Provider value={value}>{children}</AdavancedCrudContext.Provider>;
}

interface UseAdavancedCrudContextReturn {
  state: AdvancedCrudState;
  adavancedCrudContextAction: ReturnType<typeof contextActions>;
  adavancedCrudContextSelector: ReturnType<typeof contextSelectors>;
}

function useAdavancedCrudContext(): UseAdavancedCrudContextReturn {
  const context = useContext(AdavancedCrudContext);
  if (context === undefined) {
    throw new Error('useAdavancedCrudContext must be used within a AdavancedCrudContextProvider');
  }
  const [state, dispatch] = context;
  // @ts-ignore — dispatch type mismatch between reducer and actions (dependency type issue)
  const adavancedCrudContextAction = contextActions(dispatch);
  const adavancedCrudContextSelector = contextSelectors(state);
  return { state, adavancedCrudContextAction, adavancedCrudContextSelector };
}

export { AdavancedCrudContextProvider, useAdavancedCrudContext };
