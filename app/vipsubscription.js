import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { useFonts } from "expo-font";
import { Grandstander_400Regular } from "@expo-google-fonts/dev";
import AppLoading from "expo-app-loading";

export default function Vipsubscription() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Grandstander_400Regular
  })

  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <View style={styles.container}>
        <Text style={styles.titleText}>VIP</Text>
        <Text style={styles.titleText}>SUBSCRIPTION</Text>
        <Text style={styles.titleText}>21E</Text>
      <TextInput
        style={styles.input}
        placeholder="Card name"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Card number"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Expirationn Date"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="CVC"
        placeholderTextColor="gray"
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("profile")}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("profile")}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "80%",
    color: "black",
  },
  button: {
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "40%",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#72009E",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
  },
  titleText: {
    color: '#0DFF9E',
    fontSize: 25,
    fontFamily: 'Grandstander_400Reggular'
  }
});
