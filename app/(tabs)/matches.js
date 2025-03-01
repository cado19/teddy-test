import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";

export default function Matches() {
  return (
    <View style={styles.topContainer}>
      <View>
        <View className="flex">
          {/* qrcode  */}
          <View style={styles.linkStyles}>
            <Image
              source={require("../../assets/qrimage.png")}
              style={styles.qrStyle}
            />
            <Image
              source={require("../../assets/anonymous_avatars_grey_circles.jpg")}
              style={styles.pfp}
            />
            {/* Logo  */}
            <View style={styles.userDetails}>
              <Text style={styles.userDetailsText}>Nickname</Text>
              <Text style={styles.userDetailsText}>Role</Text>
              <Text style={styles.userDetailsText}>Description</Text>
            </View>
            {/* menu button  */}
            <Pressable style={styles.popularityBtn}>
              <Text style={styles.btnText}>POPULARITY</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.boxes}>
        <View style={styles.box1}></View>
        <View style={styles.box2}></View>
      </View>
      <Image source={require("../../assets/match.jpg")} style={styles.matchImage} />
      <Pressable
        onPress={() => navigation.navigate("publish")}
        style={styles.publishLink}
        className="text-center"
      >
        <FontAwesome name="plus" size={25} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: "black",
    // justifyContent: "center",
    // alignItems: "center",
  },
  qrStyle: {
    width: 50,
    height: 50,
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
  userDiv: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    gap: 10,
  },
  pfp: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
  },
  userDetails: {
    backgroundColor: "#0DFF9E",
    padding: 10,
    marginLeft: 10,
    borderRadius: 20,
    height: 50,
    width: 90,
  },
  userDetailsText: {
    fontFamily: "Itim_400Regular",
    fontSize: 7,
    color: "white",
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  box1: {
    width: 150,
    height: 250,
    backgroundColor: 'lightgray',
    margin: 15,
  },
  box2: {
    width: 150,
    height: 250,
    backgroundColor: 'lightgray',
    margin: 15,
  },
  matchImage: {
    width: 150,
    height: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 120,
    marginTop: -200,
    opacity: 0.5
  }
});
