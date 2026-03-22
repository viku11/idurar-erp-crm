import { useMemo, useReducer, createContext, useContext, ReactNode, Dispatch } from 'react';
import { initialState, contextReducer, AppState, AppAction } from './reducer';
import contextActions from './actions';

type AppContextValue = [AppState, Dispatch<AppAction>];

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

function AppContextProvider({ children }: AppContextProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value: AppContextValue = useMemo(() => [state, dispatch], [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext(): { state: AppState; appContextAction: ReturnType<typeof contextActions> } {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  const [state, dispatch] = context;
  const appContextAction = contextActions(dispatch);
  // const appContextSelector = contextSelectors(state);
  return { state, appContextAction };
}

export { AppContextProvider, useAppContext };
