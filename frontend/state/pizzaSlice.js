import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPizzaHistory = createAsyncThunk(
    'pizza/fetchPizzaHistory',
    async () => {
        const response = await fetch('http://localhost:9009/api/pizza/history');
        const data = await response.json();
        console.log(data);
        return data;
    }
);

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState: {
        loading: false,
        history: [],
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchPizzaHistory.pending, (state) => {
            state.loading = true;
        })
          .addCase(fetchPizzaHistory.fulfilled, (state,action) => {
            state.loading = false;
            state.history = action.payload;
            state.error = '';
        })
          .addCase(fetchPizzaHistory.rejected, (state,action) => {
            state.loading = false;
            state.history = [];
            state.error = action.error.message;
        });
    },
});
export default pizzaSlice.reducer;