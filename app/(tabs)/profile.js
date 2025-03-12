import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";
import { auth, firestore, storage } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [count, setCount] = useState(0);
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

  const counter = 2;

  const fetchPfp = async () => {
    try {
      const storageRef = ref(storage, currentUser?.profilePhotoUrl);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular,
  });

  const navigation = useNavigation();

  // set colour scheme 
  const colorScheme = currentUser?.fetish == 'bdsm' ? styles.light : styles.dark;


  const fetchCurrentUser = async () => {
    // console.log("got here");
    // console.log(user);
    const docRef = doc(firestore, "users", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      // console.log(docSnap.data())
      setCurrentUser(docSnap.data());
      setPending(true);
      // console.log(docSnap.data())
      const storageRef = ref(storage, currentUser?.profilePhotoUrl);
      try {
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
        setLoading(false);
        setPending(true);
        // console.log("Image url: " + imageUrl);
      } catch (error) {
        console.log("URL error: " + error);
        setLoading(false);
      }
      // setLoading(false);
    } catch (error) {
      console.log("docsnap error: " + error);
      setLoading(false);
    }
    setPending(true);

  };
  const getUser = () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);

      // fetchCurrentUser(user);
      // console.log(user);
      setPending(false);
    });
  };

  useEffect(() => {
    if (count < 4) {
      setCount(count + 1);
    }
    getUser();
    fetchCurrentUser();
    // fetchPfp();
  }, [pending]);

  // if (currentUser) {console.log(currentUser)};

  if (loading) {
    return (
      <View
        style={[{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "#000000",
        }, colorScheme]}
      >
        <ActivityIndicator size={"large"} style={{ margin: 28 }} />
      </View>
    );
  }

  return (
    <View style={[styles.topContainer, colorScheme]}>
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
            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("desplegable")}
            >
              <FontAwesome name="bars" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.userDiv}>
        <Image source={{ uri: imageUrl }} style={styles.pfp} />
        <View style={styles.userDetails}>
          <Text style={styles.userDetailsText}>{currentUser?.nickname}</Text>
          <Text style={styles.userDetailsText}>{currentUser?.role}</Text>
          <Text style={styles.userDetailsText}>{currentUser?.description}</Text>
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
          <Image source={require("../../assets/5_stars.png")} style={{ width: 50, height: 50, margin: 0, padding: 0, zoom: 5}}/>
          <Text style={styles.btnText}>POPULARITY</Text>
        </Pressable>
      </View>
      <Text
        className="text-white"
        style={{
          color: "white",
          marginTop: 15,
          fontSize: 20,
          fontFamily: "Inter_400Regular",
        }}
      >
        Latest Posts:{" "}
      </Text>
      <View style={styles.latestPostsContainer}>
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
    // backgroundColor: "black",
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
    marginRight: 10,
    borderRadius: 20,
    // height: 100,
    width: '50%',
    overflow: 'hidden'
  },
  userDetailsText: {
    fontFamily: "Itim_400Regular",
    fontSize: 15,
    color: "white",
    width: '100%'
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
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 40,
    marginLeft: 20,
  },
  btnText: {
    color: "white",
  },
  latestPostsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  latestPosts: {
    width: 120,
    height: 150,
    margin: 5,
    borderWidth: 5,
    borderColor: "grey",
    backgroundColor: "blue",
  },
  dark: {
    backgroundColor: '#000000'
  },
  light: {
    backgroundColor: '#FFFFFF'
  },
});
