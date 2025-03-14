import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

export default function WelcomeScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.signUpView}>
        <Pressable style={styles.signUpButton} onPress={() => navigation.navigate("register")}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
        </Pressable>
      </View>
      <View style={styles.loginView}>
        <Pressable style={styles.loginButton} onPress={() => navigation.navigate("login")}>
            <Text style={styles.loginButtonText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
  signUpView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black"
  },
  loginView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#04674E"
  },
  text: {
    fontSize: 20,
  },
  signUpButton: {
    backgroundColor: "#04674E",
    padding: 15,
    borderRadius: 25,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
  },
});
