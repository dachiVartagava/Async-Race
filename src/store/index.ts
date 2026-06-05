import { configureStore } from '@reduxjs/toolkit';
import viewReducer from './viewSlice';
import carReducer from './carSlice';

export const store = configureStore({
  reducer: {
    view: viewReducer,
    cars: carReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;