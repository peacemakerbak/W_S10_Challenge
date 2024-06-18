import { createSlice } from '@reduxjs/toolkit';

export const sizeFilterSlice = createSlice({
  name:'sizeFilter',
  initialState: 'All',
  reducers: {
    setSizeFilter: (state, action) => action.payload,
  },
});

export const { setSizeFilter } = sizeFilterSlice.actions;

// Selector for filtering pizza history
export const selectFilteredPizzaHistory = (state) => {
    const filterSize = state.sizeFilter;
    const pizzaHistory = state.pizza.history;

    return filterSize === 'All'
        ? pizzaHistory
        : pizzaHistory.filter(pizza => pizza.size === filterSize);
};

export default sizeFilterSlice.reducer;