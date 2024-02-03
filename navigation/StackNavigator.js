import React from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { Badge } from "react-native-paper";
import { useSelector } from "react-redux";
import LoginScreen from "../vues/loginScreen";
import RegisterScreen from "../vues/registerScreen";
import ProfileScreen from "../vues/profileScreen";
import CartScreen from "../vues/cartScreen";
import HomeScreen from "../vues/homePage";
import DetailsScreen from "../vues/detailsScreen";
import CheckoutScreen from "../vues/checkoutScreen";
import Header from "../components/Header";
import Admin from "../vues/Admin";
import UserList from "../vues/UserList";
import ArticleList from "../vues/ArticleList";
import AddArticleForm from "../vues/AddArticleForm";
import Dashboard from "../vues/Dashboard";
import RefundScreen from "../vues/RefundScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = ({ navigation }) => {
  const cart = useSelector((state) => state.cart.cart);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);

  const handleNavigation = (screen) => {
    if (isUserLoggedIn) {
      navigation.navigate(screen);
    } else {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour accéder à cette page."
      );
    }
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeApp"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#008E97" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          tabBarLabel: "Details",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleNavigation("Profile");
          },
        }}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="#008E97" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleNavigation("Cart");
          },
        }}
        options={{
          tabBarLabel: "Cart",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <AntDesign name="shoppingcart" size={24} color="#008E97" />
              ) : (
                <AntDesign name="shoppingcart" size={24} color="black" />
              )}
              <Badge
                visible={cart.length > 0}
                size={20}
                style={{ position: "absolute", top: -4, right: 45 }}
              >
                {cart.length}
              </Badge>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppStackNavigator = ({ isAdmin = false }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={isAdmin ? "Admin" : "Home"}
          component={isAdmin ? Admin : BottomTabs}
          options={{
            header: () => (isAdmin ? null : <Header />),
          }}
        />
        {!isAdmin && (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Payment"
              component={CheckoutScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Admin"
              component={Admin}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="UserList"
              component={UserList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ArticleList"
              component={ArticleList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddArticleForm"
              component={AddArticleForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RefundScreen"
              component={RefundScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStackNavigator;
