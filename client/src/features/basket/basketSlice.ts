import { createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";

interface BasketState {
    basket: Basket | null
}

const initialState: BasketState = {
    basket: null
}

export const basketSlice = createSlice ({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
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
    }
})

export const {setBasket, removeItem} = basketSlice.actions; // Export the actions specifc reducer