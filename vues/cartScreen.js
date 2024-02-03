import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incementQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const navigation = useNavigation();
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0)
    .toFixed(2);

  const dispatch = useDispatch();

  const increaseQuantity = (item) => {
    dispatch(incementQuantity(item));
  };
  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };
  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
    Toast.show({
      type: "success",
      text1: "Article supprimé du panier",
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, fontWeight: "400" }}>Total : </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>${total}</Text>
        </View>

        <Pressable
          onPress={() => {
            navigation.navigate("Payment", { total: total });
          }}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text>Passer la commande ({cart.length}) Articles</Text>
        </Pressable>

        <Text
          style={{
            height: 1,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 16,
          }}
        />

        <View style={{ marginHorizontal: 10 }}>
          {cart?.map((item, index) => (
            <View
              style={{
                backgroundColor: "white",
                marginVertical: 10,
                borderBottomColor: "#F0F0F0",
                borderWidth: 2,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
              }}
              key={index}
            >
              <Pressable
                onPress={() => {}}
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Image
                    style={{ width: 140, height: 140, resizeMode: "contain" }}
                    source={{ uri: item?.image1 }}
                  />
                </View>

                <View>
                  <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                    {item?.title}
                  </Text>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                  >
                    ${item?.price}
                  </Text>
                  <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
                    Taile: {item?.size}
                  </Text>
                  <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
                    Couleur: {item?.color}
                  </Text>
                </View>
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable
                    onPress={() => item.quantity > 1 && decreaseQuantity(item)}
                    style={{
                      backgroundColor:
                        item.quantity > 1 ? "#D8D8D8" : "#E0E0E0",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                    disabled={item.quantity === 1}
                  >
                    <AntDesign
                      name="minus"
                      size={24}
                      color={item.quantity > 1 ? "black" : "#B0B0B0"}
                    />
                  </Pressable>

                  <View
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 6,
                      backgroundColor: "white",
                    }}
                  >
                    <Text>{item.quantity}</Text>
                  </View>

                  <Pressable
                    onPress={() => increaseQuantity(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopRightRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Feather name="plus" size={24} color="black" />
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => deleteItem(item)}
                  style={{
                    backgroundColor: "white",
                    padding: 7,
                    borderRadius: 6,
                    borderWidth: 0.6,
                    borderColor: "#C0C0C0",
                  }}
                >
                  <AntDesign name="delete" size={24} color="black" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Toast />
    </>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
