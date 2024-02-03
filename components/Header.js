import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../redux/authSlice";
import { setSearchTerm } from "../redux/searchSlice";
import { setCategory } from "../redux/categorySlice";
import { Button } from "react-native-elements";

const Header = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSectionsAndCategories = async () => {
      try {
        const response = await fetch(
          "http://10.0.0.148:3000/sections-categories"
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          console.error("Erreur de réponse du serveur");
        }
      } catch (error) {
        console.error("Erreur de réseau:", error);
      }
    };

    fetchSectionsAndCategories();
  }, []);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const handleAllArticlesSelect = () => {
    setMenuVisible(false);
    dispatch(setCategory({ section: "", category: "" }));

    if (route.name !== "HomeApp") {
      navigation.navigate("HomeApp");
    }
  };

  const handleSectionSelect = (sectionName) => {
    setMenuVisible(false);
    dispatch(setCategory({ section: sectionName }));

    if (route.name !== "HomeApp") {
      navigation.navigate("HomeApp");
    }
  };
  const handleSearch = (text) => {
    dispatch(setSearchTerm(text));
    if (route.name !== "HomeApp") {
      navigation.navigate("HomeApp");
    }
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("http://10.0.0.148:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
      } else {
        console.error("Échec de la déconnexion côté serveur");
      }

      dispatch(logout());

      await AsyncStorage.removeItem("jwtToken");
      Alert.alert("Deconnexion reussi ");

      navigation.navigate("Login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <AntDesign name="menuunfold" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationIn="slideInLeft"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAllArticlesSelect()}
            style={{ marginTop: 16 }}
          >
            <Text style={styles.sectionTitle}>Tous les articles</Text>
          </TouchableOpacity>

          {Object.entries(sections).map(([sectionName, categories], index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => handleSectionSelect(sectionName)}
              >
                <Text style={styles.sectionTitle}>{sectionName}</Text>
              </TouchableOpacity>
              {categories.map((category, catIndex) => (
                <Text key={catIndex} style={styles.categoryTitle}>
                  {category}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Modal>

      <View style={styles.searchBar}>
        <AntDesign name="search1" size={22} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Rechercher"
          onChangeText={handleSearch}
        />
      </View>

      <Button
        title={isUserLoggedIn ? "Se déconnecter " : "Se connecter"}
        onPress={
          isUserLoggedIn ? handleLogout : () => navigation.navigate("Login")
        }
        buttonStyle={styles.buttonStyle}
        titleStyle={[
          styles.buttonTitleStyle,
          { color: isUserLoggedIn ? "red" : "green" },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#B8F531",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 16,
  },
  categoryTitle: {
    fontSize: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 1,
    paddingLeft: 10,
    height: 38,
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonStyle: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 38,
    paddingLeft: 10,
    height: 38,
    flex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default Header;
