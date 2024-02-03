import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RefundScreen = () => {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedRefundsString = await AsyncStorage.getItem("refunds");
        const savedRefunds = JSON.parse(savedRefundsString) || [];
        setRefunds(savedRefunds);
      } catch (error) {
        console.error("Error retrieving refund data", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteRefund = async (confirmationNumber) => {
    try {
      const updatedRefunds = refunds.filter(
        (refund) => refund.confirmationNumber !== confirmationNumber
      );
      await AsyncStorage.setItem("refunds", JSON.stringify(updatedRefunds));
      setRefunds(updatedRefunds);
      Alert.alert("Success", "Données de remboursement supprimées.");
    } catch (error) {
      console.error("Error deleting refund data", error);
      Alert.alert("Error", "Suppression des données de remboursement echouée.");
    }
  };

  if (refunds.length === 0) {
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>
        Aucun remboursement n'est disponible
      </Text>
    );
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {refunds.map((refund, index) => (
          <View key={index} style={styles.refundItem}>
            <Text style={styles.text}>
              Numero de Confirmation: {refund.confirmationNumber}
            </Text>
            <Text style={styles.text}>
              Total: ${refund.totalGroupPrice.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDeleteRefund(refund.confirmationNumber)}
            >
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 25,
    color: "#333",
  },
  refundItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RefundScreen;
