import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    const loginData = {
      email: email,
      password: password,
    };

    fetch("http://10.0.0.148:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          if (json.is_admin) {
            navigation.navigate("Admin");
          } else {
            navigation.navigate("Home");

            dispatch(
              login({
                id: json.user.userId,
                user: json.user,
                token: json.token,
              })
            );

            Alert.alert(
              "Bienvenue",
              `C'est toujours un plaisir de vous revoir, ${json.user.nom} ${json.user.prenom}`
            );
          }
        } else {
          Alert.alert("Échec de la connexion", json.message);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred during login");
        console.error(error);
      });
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Courriel"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Inscrivez-vous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.linkText}>Revenir a la page d'acceuil</Text>
        </TouchableOpacity>
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
  input: {
    width: 250,
    height: 50,
    backgroundColor: "#F5EDDE",
    padding: 15,
    marginBottom: 10,
    borderRadius: 25,
    textAlign: "center",
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
  linkText: {
    color: "#000",
    marginTop: 15,
  },
});

export default LoginScreen;
