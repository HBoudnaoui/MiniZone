import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import authReducer from "./redux/authSlice";
import categoryReducer from "./redux/categorySlice";
import searchSlice from "./redux/searchSlice";
import asyncStorageMiddleware from "./redux/asyncStorageMiddleware ";

export default configureStore({
  reducer: {
    cart: CartReducer,
    auth: authReducer,
    category: categoryReducer,
    search: searchSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(asyncStorageMiddleware),
});
