import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    user: [],
  },
  reducers: {
    setUserCart: (state, action) => {
      state.cart = action.payload;
    },
    clearCartOnLogout: (state) => {
      state.cart = [];
    },
    addToCart: (state, action) => {
      const { id, size, color } = action.payload;

      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === id && item.size === size && item.color === color
      );

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity++;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      const removeItemIndex = state.cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (removeItemIndex !== -1) {
        state.cart.splice(removeItemIndex, 1);
      }
    },
    incementQuantity: (state, action) => {
      const existingItemIndex = state.cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      const existingItemIndex = state.cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItemIndex !== -1) {
        if (state.cart[existingItemIndex].quantity === 1) {
          state.cart.splice(existingItemIndex, 1);
        } else {
          state.cart[existingItemIndex].quantity--;
        }
      }
    },
    cleanCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incementQuantity,
  decrementQuantity,
  cleanCart,
  setUserCart,
  clearCartOnLogout,
} = CartSlice.actions;

export default CartSlice.reducer;
