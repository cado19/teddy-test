import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";

export default function Chats() {
    const navigation = useNavigation();
  return (
    <View style={styles.topContainer}>
      <View className="flex">
        {/* qrcode  */}
        <View style={styles.linkStyles}>
          <Image
            source={require("../../assets/qrimage.png")}
            style={styles.qrStyle}
          />
          <Text style={styles.btnText}> CHATS </Text>
          {/* Logo  */}
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          {/* menu button  */}
          <Pressable style={styles.menuButton} onPress={() => navigation.navigate("desplegable")}>
            <FontAwesome name="bars" size={24} color="white" />
          </Pressable>
        </View>
      </View>
      {/* chat view  */}
      <View style={styles.chatbox}></View>
      <View style={styles.textBox}>
        <TextInput
          style={styles.input}
          placeholder="ENSCRIBE TU MESSAGE AQUL..."
          placeholderTextColor="gray"
        />
        <Pressable style={styles.matchBtn}><Text>ENVIAR</Text></Pressable>
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
    width: 50,
  },
  btnText: {
    color: "white",
    fontSize: 30,
  },
  chatbox: {
    width: 390,
    height: 450,
    marginTop: 30,
    borderRadius: 30,
    backgroundColor: "#72009E",
  },
  textBox: {
    marginTop: -40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    // width: "80%",
    color: "black",
  },
  matchBtn: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#29FF9B",
    padding: 15,
    borderRadius: 25,
    // width: "45%",
    alignItems: "center",
    marginLeft: 15
  },
});
