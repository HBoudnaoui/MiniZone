import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/authSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [displayContent, setDisplayContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [ville, setVille] = useState("");
  const [province, setProvince] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [commandes, setCommandes] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const formatDateString = (isoDateString) => {
    const dateObject = new Date(isoDateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };
    return dateObject.toLocaleString("fr-FR", options);
  };

  const handleEditToggle = () => {
    const fullAddress = user?.adresse.split(", ");
    setEditedUser({ ...user, adresse: fullAddress[0] });
    setVille(fullAddress[1] || "");
    setProvince(fullAddress[2] || "");
    setCodePostal(fullAddress[3] || "");
    setEditMode(!editMode);
  };

  const handleConfirmEdit = async () => {
    if (
      !editedUser.adresse.trim() ||
      !ville.trim() ||
      !province.trim() ||
      !codePostal.trim()
    ) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }
    const fullAddress = `${editedUser.adresse}, ${ville}, ${province}, ${codePostal}`;
    try {
      const updatedUserInfo = {
        userId: user.userId,
        nom: editedUser.nom,
        prenom: editedUser.prenom,
        adresse: fullAddress,
      };
      const response = await axios.post(
        "http://10.0.0.148:3000/updateUser",
        updatedUserInfo
      );

      if (response.data.success) {
        dispatch(updateUser(editedUser));
        Alert.alert(
          "Profil mis à jour",
          "Vos informations ont été mises à jour avec succès."
        );
      } else {
        Alert.alert("Erreur de mise à jour", response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour: ", error);
      Alert.alert(
        "Erreur de mise à jour",
        "Une erreur est survenue lors de la mise à jour des informations."
      );
    }
    setEditMode(false);
  };

  const fetchCommandes = async () => {
    try {
      const response = await fetch("http://10.0.0.148:3000/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();
      setCommandes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchCommandes();
    }
  }, [user?.userId]);

  const groupCommandesByConfirmationNumber = (commandes) => {
    const grouped = {};

    commandes.forEach((commande) => {
      const confirmationNumber = commande.Numero_de_confirmation;

      if (!grouped[confirmationNumber]) {
        grouped[confirmationNumber] = [];
      }

      grouped[confirmationNumber].push(commande);
    });

    return grouped;
  };

  const renderOrders = () => {
    const groupedCommandes = groupCommandesByConfirmationNumber(
      commandes.data || []
    );

    const handleRefundPress = async (confirmationNumber, totalGroupPrice) => {
      try {
        const newRefundData = { confirmationNumber, totalGroupPrice };

        const refundsDataString = await AsyncStorage.getItem("refunds");
        const refundsData = JSON.parse(refundsDataString) || [];

        refundsData.push(newRefundData);

        await AsyncStorage.setItem("refunds", JSON.stringify(refundsData));

        Alert.alert(
          "Données de remboursement envoyées",
          "Votre demande sera traitée par l'administrateur."
        );
      } catch (error) {
        console.error("Error storing refund data", error);
        Alert.alert("Error", "Failed to save refund data.");
      }
    };
    return (
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        {Object.keys(groupedCommandes).length > 0 ? (
          Object.entries(groupedCommandes).map(
            ([confirmationNumber, group], groupIndex) => {
              const totalGroupPrice = group.reduce(
                (total, item) => total + item.Prix * item.Quantite,
                0
              );

              return (
                <View
                  key={groupIndex}
                  style={{
                    marginBottom: 25,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    padding: 15,
                    backgroundColor: "#94ffc1",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      marginBottom: 10,
                    }}
                  >
                    Numero de confirmation: {confirmationNumber}
                  </Text>
                  {group.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 25,
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 10,
                        padding: 15,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 3,
                      }}
                    >
                      <Image
                        style={{
                          width: 90,
                          height: 90,
                          resizeMode: "contain",
                          marginRight: 15,
                        }}
                        source={{ uri: item.Image_1 }}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {item.Nom_article}
                        </Text>
                        <Text style={{ color: "green", marginTop: 5 }}>
                          Date de commande:{" "}
                          {formatDateString(item.Date_Commande)}
                        </Text>
                        <Text style={{ marginTop: 5 }}>
                          Quantite: {item.Quantite}
                        </Text>
                        <Text style={{ marginTop: 5, fontSize: 16 }}>
                          Prix unitaire: ${item.Prix}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#FFC72C",
                            alignSelf: "flex-end",
                            marginTop: 10,
                          }}
                        >
                          Total: ${item.Prix * item.Quantite}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "black",
                      alignSelf: "flex-end",
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Total de la Commande: ${totalGroupPrice.toFixed(2)}
                  </Text>
                  <Button
                    onPress={() =>
                      handleRefundPress(confirmationNumber, totalGroupPrice)
                    }
                    title="Remboursement"
                    color="#FFC72C"
                  />
                </View>
              );
            }
          )
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Aucune commande disponible.
          </Text>
        )}
      </ScrollView>
    );
  };

  const renderAccountInfo = () => {
    if (editMode) {
      return (
        <View style={{ marginTop: 20 }}>
          <TextInput
            style={styles.input}
            value={editedUser.nom}
            onChangeText={(text) => setEditedUser({ ...editedUser, nom: text })}
          />
          <TextInput
            style={styles.input}
            value={editedUser.prenom}
            onChangeText={(text) =>
              setEditedUser({ ...editedUser, prenom: text })
            }
          />
          <TextInput
            style={styles.input}
            value={editedUser.adresse}
            onChangeText={(text) =>
              setEditedUser({ ...editedUser, adresse: text })
            }
            placeholder="Adresse"
          />
          <TextInput
            style={styles.input}
            value={ville}
            onChangeText={setVille}
            placeholder="Ville"
          />
          <TextInput
            style={styles.input}
            value={province}
            onChangeText={setProvince}
            placeholder="Province"
          />
          <TextInput
            style={styles.input}
            value={codePostal}
            onChangeText={setCodePostal}
            placeholder="Code Postal"
          />
          <Pressable style={styles.formButton} onPress={handleConfirmEdit}>
            <Text>Confirmer</Text>
          </Pressable>
          <Pressable
            style={styles.formButton}
            onPress={() => setEditMode(false)}
          >
            <Text>Retour</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.userContainer}>
        <Text style={styles.text}>Nom: {user?.nom}</Text>
        <Text style={styles.text}>Prénom: {user?.prenom}</Text>
        <Text style={styles.text}>Adresse: {user?.adresse}</Text>
        <Pressable style={styles.editButton} onPress={handleEditToggle}>
          <Text style={styles.editButtonText}>Modifier</Text>
        </Pressable>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Bonjour {user?.prenom} {user?.nom} !
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            setDisplayContent("orders");
            fetchCommandes(); // Appeler fetchCommandes à chaque clic sur le bouton
          }}
        >
          <Text style={styles.buttonText}>Vos Commandes</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setDisplayContent("account")}
        >
          <Text style={styles.buttonText}>Votre compte</Text>
        </Pressable>
      </View>

      {displayContent === "orders" && renderOrders()}
      {displayContent === "account" && renderAccountInfo()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "white",
  },
  greeting: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  button: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    textAlign: "center",
  },
  userContainer: {
    marginTop: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  editButton: {
    alignItems: "center",
    backgroundColor: "#FFC72C",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
    color: "#333",
  },

  formButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
