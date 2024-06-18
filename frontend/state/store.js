import { configureStore } from '@reduxjs/toolkit';
import pizzaReducer from './pizzaSlice';
import pizzaOrderReducer from './pizzaOrderSlice';
import sizeFilterReducer from './sizeFilterSlice';

export const resetStore = () => configureStore({
  reducer: {
    pizza: pizzaReducer,
    pizzaOrder: pizzaOrderReducer,
    sizeFilter: sizeFilterReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export const store = resetStore();
export default store;