import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";

export default function Profile() {
  
  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular
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
              source={require("../../assets/qrimage.png")}
              style={styles.qrStyle}
            />
            {/* menu button  */}
            <Pressable style={styles.menuButton} onPress={() => navigation.navigate("desplegable")}>
              <FontAwesome name="bars" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.userDiv}>
        <Image
          source={require("../../assets/anonymous_avatars_grey_circles.jpg")}
          style={styles.pfp}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userDetailsText}>Nickname</Text>
          <Text style={styles.userDetailsText}>Role</Text>
          <Text style={styles.userDetailsText}>Description</Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <Pressable style={styles.friendsBtn}>
          <Text style={styles.btnText}>FRIENDS</Text>
        </Pressable>
        <Pressable style={styles.matchBtn}>
          <Text style={styles.btnText}>MATCH</Text>
        </Pressable>
        <Pressable style={styles.popularityBtn}>
          <Text style={styles.btnText}>POPULARITY</Text>
        </Pressable>
      </View>
      <Text className='text-white' style={{ color: 'white', marginTop: 15, fontSize: 20, fontFamily: 'Inter_400Regular' }}>Latest Posts: </Text>
      <View style={styles.latestPostsContainer} >
        <View style={styles.latestPosts}></View>
        <View style={styles.latestPosts}></View>
        <View style={styles.latestPosts}></View>
      </View>
      <Text>Profile</Text>
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
    backgroundColor: 'black',
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
  userDiv: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    gap: 20,

  },
  pfp: {
    width: 150,
    height: 150,
    borderRadius: 40,
    justifyContent: "center",
  },
  userDetails: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    marginLeft: 10,
    borderRadius: 20,
    height: 100
  },
  userDetailsText: {
    fontFamily: "Itim_400Regular",
    fontSize: 15,
    color: "white",
  },
  friendsBtn: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 25,
    // width: "45%",
    alignItems: "center",
  },
  matchBtn: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#29FF9B",
    padding: 15,
    borderRadius: 25,
    // width: "45%",
    alignItems: "center",
  },
  popularityBtn: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 25,
    // width: "45%",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 40,
    marginLeft: 20
  },
  btnText: {
    color: 'white'
  },
  latestPostsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },
  latestPosts: {
    width: 120,
    height: 150,
    margin: 5,
    borderWidth: 5,
    borderColor: 'grey',
    backgroundColor: 'blue'
  }

});
