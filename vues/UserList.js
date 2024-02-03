import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchUserList = async () => {
    try {
      const response = await fetch("http://YourLocalHost:3000/users");

      if (!response.ok) {
        if (response.status === 404) {
          console.error("User list not found (404)");
        } else {
          throw new Error(
            `Server returned ${response.status} ${response.statusText}`
          );
        }
      } else {
        const data = await response.json();
        setUserData(data.data);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <SafeAreaView style={styles.userListContainer}>
      <ScrollView>
        <Text style={styles.chartLabel}>Liste des Utilisateurs</Text>
        {userData.map((user, index) => (
          <View key={index} style={styles.userDataContainer}>
            <Text style={styles.userName}>
              {user.Nom} {user.Prenom}
            </Text>
            <Text style={styles.userEmail}>{user.Courriel}</Text>
            <Text style={styles.userEmail}>{user.Adresse}</Text>
            {index < userData.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userListContainer: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  userDataContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "#eaecef",
    marginVertical: 10,
  },
  footer: {
    padding: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
});

export default UserList;
