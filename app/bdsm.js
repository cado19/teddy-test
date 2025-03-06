import { View, Text, StyleSheet, Image, ImageBackground, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

export default function Bdsm() {
  const navigation = useNavigation();
  return (
    <ImageBackground source={require("../assets/bdsm.jpg")} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("(tabs)")}
      >
        <Text style={styles.buttonText}>ENTER THE UNIVERSE</Text>
      </Pressable>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});
