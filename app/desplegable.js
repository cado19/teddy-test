import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";

export default function Desplagable() {
  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular,
  });

  const navigation = useNavigation();

  return (
    <View style={styles.topContainer}>
      {/* top view with qr code and menu icon  */}
      <View>
        <View className="flex">
          {/* qrcode  */}
          <View style={styles.linkStyles}>
            <Image
              source={require("../assets/qrimage.png")}
              style={styles.qrStyle}
            />
            {/* menu button  */}
            <Pressable style={styles.menuButton}>
              <FontAwesome name="bars" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      {/* div with the links  */}
      <View style={styles.btnContainer}>
        <Pressable style={styles.btnBody}>
          <Text style={styles.btnText} onPress={() => navigation.navigate("bot")}>Teddy's Bot</Text>
        </Pressable>
        <Pressable style={styles.addBtnBody} onPress={() => navigation.navigate("addfriend")}>
          <FontAwesome
            name="plus"
            size={20}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.btnText}>ADD FRIEND</Text>
        </Pressable>
        <Pressable style={styles.btnBody} onPress={() => navigation.navigate("vipsubscription")}>
          <Text style={styles.btnText}>VIP SUBSCRIPTION</Text>
        </Pressable>
        <Pressable style={styles.btnBody}>
          <Text style={styles.btnText}>COMING SOON</Text>
        </Pressable>
      </View>
      <Text>Desplagable</Text>
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
    justifyContent: "space-between",
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
  btnContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 10,
    padding: 30,
    borderRadius: 10,
    backgroundColor: "#0DFF9E",
  },
  btnBody: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginBottom: 40,
  },
  addBtnBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "",
    borderRadius: 30,
    padding: 20,
    backgroundColor: "white",
    marginBottom: 40,
  },
  btnText: {
    fontSize: 20,
    fontFamily: "Itim_400Regular",
  },
});
