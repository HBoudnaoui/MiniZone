import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const DetailsScreen = () => {
  const route = useRoute();
  const variantesArray = JSON.parse(route?.params?.variantes);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);

  const dispatch = useDispatch();

  const addItemToCart = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter des articles au panier.",
        [{ text: "OK" }]
      );
      return;
    }
    if (!selectedSize || !selectedColor) {
      Alert.alert(
        "Sélection requise",
        "Veuillez choisir une taille et une couleur avant d'ajouter au panier.",
        [{ text: "OK" }]
      );
      return;
    }
    const itemId = route?.params?.id_article;

    if (itemId) {
      const selectedVariant = variantesArray.find(
        (variant) =>
          variant.Description_Taille === selectedSize &&
          variant.Couleur === selectedColor
      );

      const item = {
        id: itemId,
        id_taille: selectedVariant?.Taille_ID || null,
        id_couleur: selectedVariant?.Couleur_ID || null,
        title: route?.params?.title,
        price: route?.params?.price,
        details: route?.params?.details,
        image1: route?.params?.image1,
        size: selectedSize,
        color: selectedColor,
      };

      dispatch(addToCart(item));
      setAddedToCart(true);
      Toast.show({
        type: "success",
        text1: "Article ajouté au panier",
        position: "bottom",
        visibilityTime: 3000,
      });
      setSelectedSize("");
      setSelectedColor("");
    } else {
      console.error("Item ID is undefined");
    }
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);

    setSelectedColor("");
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const availableColors = variantesArray
    .filter(
      (variant) =>
        variant.Description_Taille === selectedSize && variant.Quantite > 0
    )
    .map((variant) => variant.Couleur);

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "white" }}
          showsVerticalScrollIndicator={false}
        >
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            autoplay
            loop
            dotColor="#90A4AE"
            activeDotColor="#13274F"
          >
            {[
              route?.params?.image1,
              route?.params?.image2,
              route?.params?.image3,
            ].map((image, index) => (
              <View style={styles.slide} key={index}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            ))}
          </Swiper>
        </ScrollView>

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            {route?.params?.title}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
            ${route?.params?.price}
          </Text>
        </View>

        <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

        <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
            {route?.params?.details}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 5,
              alignItems: "center",
              gap: 5,
            }}
          ></View>
        </View>

        <Text
          style={{
            color: "green",
            marginHorizontal: 10,
            marginBottom: 10,
            fontWeight: "500",
          }}
        >
          En Stock
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            marginBottom: 10,
            fontWeight: "500",
          }}
        >
          Choisir une Taille:
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          {["S", "M", "L", "XL"].map((size, index) => {
            const variant = variantesArray.find(
              (variant) => variant.Description_Taille === size
            );

            const isSizeAvailable = variant && variant.Quantite > 0;

            return (
              <View
                key={index}
                style={{
                  backgroundColor:
                    selectedSize === size
                      ? "#FFC72C"
                      : isSizeAvailable
                      ? "#E0E0E0"
                      : "#CCCCCC",
                  padding: 10,
                  borderRadius: 50,
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 50,
                  opacity: isSizeAvailable ? 1 : 0.5,
                }}
              >
                <Pressable
                  onPress={() => isSizeAvailable && handleSizeSelection(size)}
                  disabled={!isSizeAvailable}
                >
                  <Text
                    style={{
                      fontWeight: "800",
                      textDecorationLine: isSizeAvailable
                        ? "none"
                        : "line-through",
                    }}
                  >
                    {size}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        {selectedSize && (
          <>
            <Text
              style={{
                marginHorizontal: 10,
                marginBottom: 10,
                fontWeight: "500",
              }}
            >
              Choisir une Couleur:
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              {availableColors.map((color, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleColorSelection(color)}
                  style={{
                    backgroundColor:
                      selectedColor === color ? "#FFC72C" : "#E0E0E0",
                    padding: 10,
                    borderRadius: 50,
                    marginRight: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 50,
                  }}
                >
                  <Text style={{ fontWeight: "800" }}>{color}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Pressable
          onPress={() => addItemToCart(route?.params?.item)}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text>Ajouter au panier</Text>
        </Pressable>
      </ScrollView>
      <Toast />
    </>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    flex: 1,
    resizeMode: "contain",
  },
});
