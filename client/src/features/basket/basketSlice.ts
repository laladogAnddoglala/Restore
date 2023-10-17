import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

interface BasketState {
    basket: Basket | null;
    status: string;        // Loading state
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

// Add Basket Item action
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity: number}>( // Basket is the return type
    'basket/addBasketItemAsync',
    async ({productId, quantity}) => {                      // Match the agurement type
        try {
            return await agent.Basket.addItem(productId, quantity);  // Add item with API
        } catch (error) {
            console.log(error);
        }
    }
)

export const basketSlice = createSlice ({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {   // state is from redux store, action is created and dispatched from the component 
            state.basket = action.payload
        },
        removeItem: (state, action) => {
            const {productId, quantity} = action.payload;
            const ItemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if (ItemIndex === -1 || ItemIndex === undefined) return;    // Safety check, in case basket is empty
            state.basket!.items[ItemIndex].quantity -= quantity;
            if (state.basket?.items[ItemIndex].quantity === 0) {
                state.basket.items.splice(ItemIndex, 1); // Remove item from basket
            }           
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            console.log(action);
            state.status = 'pedingAddItem';
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        })
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
        })
    })
}) 

export const {setBasket, removeItem} = basketSlice.actions; // Export the actions specifc reducer