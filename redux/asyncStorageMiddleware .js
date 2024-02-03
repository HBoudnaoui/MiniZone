import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserCart, clearCartOnLogout } from "./CartReducer";

const asyncStorageMiddleware = (store) => (next) => async (action) => {
  if (action.type === "auth/login" && action.payload && action.payload.user) {
    const userId = action.payload.user.userId;
    const savedCart = await AsyncStorage.getItem(`cart_${userId}`);
    if (savedCart) {
      store.dispatch(setUserCart(JSON.parse(savedCart)));
    }
  }

  if (action.type === "auth/logout") {
    const user = store.getState().auth.user;
    if (user && user.userId) {
      const userId = user.userId;
      const currentCart = store.getState().cart.cart;
      await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(currentCart));
      store.dispatch(clearCartOnLogout());
    }
  }

  return next(action);
};

export default asyncStorageMiddleware;
