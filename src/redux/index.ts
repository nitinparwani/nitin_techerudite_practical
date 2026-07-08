import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import favoriteReducer from './slices/favoriteSlice';

const rootReducer = combineReducers({
  favorite: favoriteReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
