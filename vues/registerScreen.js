import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

function RegistrationScreen({ navigation }) {
  const [page, setPage] = useState(1);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [province, setProvince] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const goToNextPage = () => {
    if (!nom.trim() || !prenom.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
    } else if (!validateEmail(email)) {
      Alert.alert("Erreur", "L'adresse courriel n'est pas valide.");
    } else {
      setPage(2);
    }
  };

  const handleRegistration = () => {
    if (
      !adresse.trim() ||
      !ville.trim() ||
      !province.trim() ||
      !codePostal.trim()
    ) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
    } else {
      const fullAddress = [adresse, ville, province, codePostal].join(", ");

      const userData = {
        nom,
        prenom,
        adresse: fullAddress,
        email,
        password,
      };

      fetch("http://YourLocalHost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            Alert.alert("Inscritpion Réussi", "Bienvenue parmis nous");
            navigation.navigate("Login");
          } else {
            Alert.alert("Echec Inscritpion", json.message);
          }
        })
        .catch((error) => {
          console.error("Registration Error: ", error);
          Alert.alert("Error", "An error occurred during registration");
        });
    }
  };
  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>S'inscrire</Text>
        <View style={styles.container}>
          {page === 1 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={nom}
                onChangeText={setNom}
              />
              <TextInput
                style={styles.input}
                placeholder="Prenom"
                value={prenom}
                onChangeText={setPrenom}
              />
              <TextInput
                style={styles.input}
                placeholder="Courriel"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>
                  Vous avez un compte ? Se connecter.
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => goToNextPage()}
                >
                  <Text style={styles.buttonText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {page === 2 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Adresse"
                value={adresse}
                onChangeText={setAdresse}
              />
              <TextInput
                style={styles.input}
                placeholder="Ville"
                value={ville}
                onChangeText={setVille}
              />
              <TextInput
                style={styles.input}
                placeholder="Province"
                value={province}
                onChangeText={setProvince}
              />
              <TextInput
                style={styles.input}
                placeholder="Code postal"
                value={codePostal}
                onChangeText={setCodePostal}
              />
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>
                  Vous avez un compte ? Se connecter.
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setPage(1)}
                >
                  <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>

                <View style={styles.separator} />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegistration}
                >
                  <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  logo: {
    width: 350,
    height: 350,
  },
  headerText: {
    fontSize: 34,
    color: "#000000",
    marginBottom: 10,
  },
  input: {
    width: 250,
    height: 50,
    backgroundColor: "#F5EDDE",
    padding: 15,
    marginBottom: 10,
    borderRadius: 25,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 120,
    backgroundColor: "orange",
    padding: 15,
    margin: 5,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  separator: {
    width: 10,
  },

  linkButton: {
    width: "100%",
    backgroundColor: "#64b5f6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  linkButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    color: "#000",
    marginTop: 15,
  },
});

export default RegistrationScreen;
