import { View, Text, Image, Pressable, StyleSheet, TextInput } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";

export default function Addfriend() {
  return (
    <View style={styles.topContainer}>
      <View>
        <View className="flex">
          {/* qrcode  */}
          <View style={styles.linkStyles}>
            <Image
              source={require("../assets/qrimage.png")}
              style={styles.qrStyle}
            />
            <Text style={styles.btnText}> <FontAwesome name="plus" size={20} color="white" style={{ marginRight: 10 }} /> ADD FRIEND </Text>
            {/* Logo  */}
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            {/* menu button  */}
            <Pressable style={styles.menuButton}>
              <FontAwesome name="bars" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      <View>
        <TextInput style={styles.input} placeholder="Friend" placeholderTextColor="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrStyle: {
    width: 50,
    height: 50,
  },
  topContainer: {
    flex: 1,
    backgroundColor: "black",

    // justifyContent: "center",
    // alignItems: "center",
  },
  linkStyles: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    // width: "80%",
  },
  menuButton: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    borderRadius: 50, // Makes the button rounded
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  logo: {
    height: 50,
    width: 50
  },
  btnText: {
    fontSize: 30,
    fontFamily: "Itim_400Regular",
    color: 'white'
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "80%",
    color: "black",
  },
});
