import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPizzaHistory } from './pizzaSlice';

export const submitPizzaOrder = createAsyncThunk(
    'pizzaOrder/submitPizzaOrder',
    async (order, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const response = await fetch('http://localhost:9009/api/pizza/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });
            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error);
            }
            return await response.json();
            } catch (error) {
                return rejectWithValue(error.message);
            }
    }
);

const pizzaOrderSlice = createSlice({
    name: 'pizzaOrder',
    initialState: {
        order: {},
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetOrderState: (state) => {
            state.order = {};
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitPizzaOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitPizzaOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
                state.error = null;
                fetchPizzaHistory();
            })
            .addCase(submitPizzaOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetOrderState } = pizzaOrderSlice.actions;
export default pizzaOrderSlice.reducer;