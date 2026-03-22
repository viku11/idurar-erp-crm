import React, { useMemo, useReducer, createContext, useContext, ReactNode } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';
import contextSelectors from './selectors';

type ProfileState = typeof initialState;
type ProfileAction = Parameters<typeof contextReducer>[1];
type ProfileContextValue = [ProfileState, React.Dispatch<ProfileAction>];

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

interface ProfileContextProviderProps {
  children: ReactNode;
}

function ProfileContextProvider({ children }: ProfileContextProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value: ProfileContextValue = useMemo(() => [state, dispatch], [state]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

interface UseProfileContextReturn {
  state: ProfileState;
  profileContextAction: ReturnType<typeof contextActions>;
  profileContextSelector: ReturnType<typeof contextSelectors>;
}

function useProfileContext(): UseProfileContextReturn {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileContextProvider');
  }
  const [state, dispatch] = context;
  const profileContextAction = contextActions(dispatch);
  // @ts-ignore - ProfileState from reducer does not match ProfileContextState expected by selectors
  const profileContextSelector = contextSelectors(state);
  return { state, profileContextAction, profileContextSelector };
}

export { ProfileContextProvider, useProfileContext };
