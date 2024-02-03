import React, { useState, useEffect } from "react";
import StackNavigator from "./navigation/StackNavigator";
import store from "./store";
import { Provider } from "react-redux";
import { StripeProvider } from "@stripe/stripe-react-native";

function App() {
  useEffect(() => {}, []);
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey="pk_test_51ON0ZBLTJxJWsXRsvUfszZZCtJmWYbLBPqpl5PzKNh9CvdTmqP5ImVIyAexGKQK0fuiFPFFkjTUDLRuWdpvBE24W00Jp8ozGl3"
        urlScheme="Minizone"
        merchantIdentifier="merchant.com.{Minizone}"
      >
        <StackNavigator />
      </StripeProvider>
    </Provider>
  );
}

export default App;
