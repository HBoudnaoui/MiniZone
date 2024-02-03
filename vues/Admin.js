import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Admin() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginTop: 50,
      }}
    >
      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate("Dashboard");
        }}
      >
        <View style={styles.circle}>
          <AntDesign name="dashboard" size={24} color="white" />
        </View>
        <Text style={styles.cardText}>Dashboard</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate("ArticleList");
        }}
      >
        <View style={[styles.circle, { backgroundColor: "#F8802B" }]}>
          <Ionicons name="md-cart" size={24} color="white" />
        </View>
        <Text style={styles.cardText}>Produits</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate("UserList");
        }}
      >
        <View style={[styles.circle, { backgroundColor: "#50C768" }]}>
          <Ionicons name="md-people" size={24} color="white" />
        </View>
        <Text style={styles.cardText}>Clients</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate("AddArticleForm");
        }}
      >
        <View style={[styles.circle, { backgroundColor: "#FF4982" }]}>
          <AntDesign name="inbox" size={24} color="white" />
        </View>
        <Text style={styles.cardText}>Ajout d'article(s)</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate("RefundScreen");
        }}
      >
        <View style={[styles.circle, { backgroundColor: "#A505F1" }]}>
          <MaterialCommunityIcons
            name="credit-card-refund-outline"
            size={24}
            color="white"
          />
        </View>
        <Text style={styles.cardText}>Remboursements</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 25,
    backgroundColor: "#282449",
    width: "80%",
    height: 100,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 25,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cardText: {
    textAlign: "center",
    marginTop: 10,
    color: "white",
  },
});
