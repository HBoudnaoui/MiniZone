import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Image } from "react-native";
import { Pressable, Text, SafeAreaView } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
const CheckoutScreen = () => {
  const route = useRoute();
  const total = route?.params?.total;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user);
  const name = user.nom + " " + user.prenom;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const API_URL = "http://10.0.0.148:3000";
  const fetchPaymentSheetParams = async () => {
    try {
      const simplifiedCart = cart.map((item) => ({
        id: item.id,
        id_couleur: item.id_couleur,
        id_taille: item.id_taille,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      }));

      const response = await fetch(`${API_URL}/payment-minizone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: simplifiedCart,
          total: total,
          user: {
            userID: user.userId,
            name: user.nom,
            lastName: user.prenom,
            address: user.adresse,
            email: user.email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        paymentIntent: data.paymentIntent,
        ephemeralKey: data.ephemeralKey,
        customer: data.customer,
      };
    } catch (error) {
      console.error("Fetch failed!", error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Minizone",
      customerId: user.userId,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: name,
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Erreur: ${error.code}`, error.message);
    } else {
      Alert.alert(
        "Transaction completée",
        "Votre paiement a été approuvé, merci d'avoir magasiner chez Minizone ! "
      );
      dispatch(cleanCart());
      navigation.navigate("Profile");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          disabled={!loading}
          onPress={openPaymentSheet}
        >
          <Text style={styles.buttonText}>Payer ici</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Fond vert pour tout l'écran
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 500,
    height: 500,
    // Autres styles pour le logo si nécessaire
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "orange",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 100,
  },
  buttonText: {},
});

export default CheckoutScreen;
