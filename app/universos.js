import { View, Pressable, Text, StyleSheet } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { GochiHand_400Regular } from "@expo-google-fonts/dev";
import AppLoading from "expo-app-loading";
import { useNavigation } from "expo-router";

export default function Universos() {
    const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    GochiHand_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.bdsmButton}
          onPress={() => navigation.navigate("bdsm")}
        >
          <Text style={styles.buttonText}>BDSM</Text>
        </Pressable>
        <Pressable
          style={styles.ddlgButton}
          onPress={() => navigation.navigate("ddlg")}
        >
          <Text style={styles.buttonText}>DDLG</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202020"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  bdsmButton: {
    fontFamily: "GochiHand_400Regular",
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  ddlgButton: {
    fontFamily: "GochiHand_400Regular",
    backgroundColor: "#29FF9B",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "GochiHand_400Regular",
    color: "white",
    fontSize: 18,
  },
});
