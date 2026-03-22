import { configureStore } from '@reduxjs/toolkit';

// @ts-ignore
import lang from '@/locale/translation/en_us';

import rootReducer, { RootState } from './rootReducer';
import storePersist from './storePersist';

// localStorageHealthCheck();

const AUTH_INITIAL_STATE: RootState['auth'] = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const persistedAuth: unknown = storePersist.get('auth');

const auth_state: RootState['auth'] = persistedAuth
  ? (persistedAuth as RootState['auth'])
  : AUTH_INITIAL_STATE;

const initialState: Partial<RootState> = { auth: auth_state };

const store = configureStore({
  reducer: rootReducer,
  // @ts-ignore — preloadedState type mismatch due to untyped upstream reducers
  preloadedState: initialState,
  devTools: import.meta.env.PROD === false, // Enable Redux DevTools in development mode
});

console.log(
  '\u{1F680} Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
);

export type AppDispatch = typeof store.dispatch;

export default store;
