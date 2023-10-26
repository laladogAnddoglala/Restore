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

// Add Basket Item AsyncThunk action
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>( // Basket is the return type
    'basket/addBasketItemAsync',    // Action type
    async ({productId, quantity = 1}) => {                      // Match the agurement type
        try {
            return await agent.Basket.addItem(productId, quantity);  // Add item with API
        } catch (error) {
            console.log(error);
        }
    }
)

// Remove Basket Item AsyncThunk action
export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity?: number}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity = 1}) => {
        try {
            return await agent.Basket.removeItem(productId, quantity);  // Remove item with API
        } catch (error) {
            console.log(error);
        }
    }
)

export const basketSlice = createSlice ({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {     // Action type is basket/setBasket, action creator is setBasket, and this whole is action-type-specific case reducers
            state.basket = action.payload   // state is from redux store, action is created and dispatched from the component 
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
        builder.addCase(addBasketItemAsync.pending, (state, action) => {    // Mapping to addBasketItemAsync, modify status
            console.log(action);
            state.status = 'pedingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            console.log(action);
            state.basket = action.payload;  // Updata basket
            state.status = 'idle';
        })
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
        })
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {    // Mapping to removeBasketItemAsync, modify status
            state.status = 'pedingRemoveItem' + action.meta.arg.productId;
        });
    })
}) 

export const {setBasket, removeItem} = basketSlice.actions; // Export the actions specifc reducer