import { createSelector } from 'reselect';

interface AuthState {
  current: Record<string, unknown> | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

interface RootState {
  auth: AuthState;
  [key: string]: unknown;
}

const selectAuth = (state: RootState): AuthState => state.auth;
export { selectAuth };

export const selectCurrentAdmin = createSelector(
  [selectAuth],
  (auth: AuthState): Record<string, unknown> | null => auth.current
);

export const isLoggedIn = createSelector(
  [selectAuth],
  (auth: AuthState): boolean => auth.isLoggedIn
);
