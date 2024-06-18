import { configureStore, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state for orders
const initialOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

// Create a slice for orders
const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrdersState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
    },
    fetchOrdersSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload || [];
    },
    fetchOrdersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addOrder(state, action) {
      state.orders.push(action.payload);
    },
  },
});

// Define initial state for form
const initialFormState = {
  fullName: '',
  size: '',
  toppings: {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
  loading: false,
  error: null,
};

// Create a slice for form
const formSlice = createSlice({
  name: 'form',
  initialState: initialFormState,
  reducers: {
    updateForm(state, action) {
      const { name, value } = action.payload;
      state[name] = value;
    },
    updateTopping(state, action) {
      const { name, value } = action.payload;
      state.toppings[name] = value;
    },
    submitFormStart(state) {
      state.loading = true;
    },
    submitFormSuccess(state) {
      return initialFormState;
    },
    submitFormFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Define initial state for filters
const initialFiltersState = {
  size: 'All',
};

// Create a slice for filters
const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFiltersState,
  reducers: {
    setSizeFilter(state, action) {
      state.size = action.payload;
    },
  },
});

// Async action creators
const fetchOrders = () => async dispatch => {
  dispatch(ordersSlice.actions.fetchOrdersStart());
  try {
    const response = await axios.get('http://localhost:9009/api/pizza/history');
    dispatch(ordersSlice.actions.fetchOrdersSuccess(response.data));
  } catch (error) {
    dispatch(ordersSlice.actions.fetchOrdersFailure(error.message));
  }
};

const submitOrder = order => async dispatch => {
  dispatch(formSlice.actions.submitFormStart());
  try {
    const response = await axios.post('http://localhost:9009/api/pizza/order', order);
    dispatch(formSlice.actions.submitFormSuccess());
    dispatch(ordersSlice.actions.addOrder(order));
  } catch (error) {
    dispatch(formSlice.actions.submitFormFailure(error.response?.data?.message || error.message));
  }
};

// Combine reducers
const rootReducer = {
  orders: ordersSlice.reducer,
  form: formSlice.reducer,
  filters: filtersSlice.reducer,
};

// Function to create and configure a new store instance
const createStore = () => configureStore({
  reducer: rootReducer,
});

// Configure the initial store instance
const store = createStore();

// Define resetStore function to create a new store instance
const resetStore = () => createStore();

// Export actions and async action creators
export const { updateForm, updateTopping } = formSlice.actions;
export const { setSizeFilter } = filtersSlice.actions;
export { store, resetStore, fetchOrders, submitOrder };
