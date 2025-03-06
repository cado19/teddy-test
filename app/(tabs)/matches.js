import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";

// Firebase
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import firebaseApp from "../../firebaseConfig";

export default function Matches() {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular,
  });

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated.");
      setLoading(false);
      return;
    }

    // Listen for matches where the current user is user1
    // If you also want user2 = currentUser.uid, you can do multiple queries or an OR query
    const q = query(
      collection(firestore, "matches"),
      where("user1", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMatches = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMatches(fetchedMatches);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) return null;

  // For styling, we keep your original layout, but add a list for matched users
  return (
    <View style={styles.topContainer}>
      {/* Header area with QR, pfp, user details, etc. */}
      <View>
        <View style={styles.linkStyles}>
          <Image
            source={require("../../assets/qrimage.png")}
            style={styles.qrStyle}
          />
          <Image
            source={require("../../assets/anonymous_avatars_grey_circles.jpg")}
            style={styles.pfp}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userDetailsText}>Nickname</Text>
            <Text style={styles.userDetailsText}>Role</Text>
            <Text style={styles.userDetailsText}>Description</Text>
          </View>
          <Pressable style={styles.popularityBtn}>
            <Text style={styles.btnText}>POPULARITY</Text>
          </Pressable>
        </View>
      </View>

      {/* Boxes for UI placeholders; you can adapt these to show matched profiles */}
      <View style={styles.boxes}>
        {/* We can remove the static second box and show a list of matches in the first one */}
        <View style={styles.box1}>
          {loading ? (
            <Text style={{ color: "black", margin: 5 }}>Loading matches...</Text>
          ) : matches.length === 0 ? (
            <Text style={{ color: "black", margin: 5 }}>No matches yet.</Text>
          ) : (
            <FlatList
              data={matches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                // figure out the matched user
                const currentUserUid = auth.currentUser?.uid;
                const otherUserId =
                  item.user1 === currentUserUid ? item.user2 : item.user1;

                return (
                  <Pressable
                    style={styles.matchItem}
                    onPress={() =>
                      navigation.navigate("Chats", { otherUserId })
                    }
                  >
                    <Text style={{ color: "black" }}>
                      Matched with: {otherUserId}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
        <View style={styles.box2}></View>
      </View>

      <Image
        source={require("../../assets/match.jpg")}
        style={styles.matchImage}
      />

      {/* Example button to go to publish screen */}
      <Pressable
        onPress={() => navigation.navigate("publish")}
        style={styles.publishLink}
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
  },
  qrStyle: {
    width: 50,
    height: 50,
  },
  linkStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
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
  popularityBtn: {
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginLeft: 10,
  },
  btnText: {
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: 10,
  },
  boxes: {
    flexDirection: "row",
    justifyContent: "center",
  },
  box1: {
    width: 150,
    height: 250,
    backgroundColor: "lightgray",
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  box2: {
    width: 150,
    height: 250,
    backgroundColor: "lightgray",
    margin: 15,
    borderRadius: 10,
  },
  matchImage: {
    width: 150,
    height: 150,
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 120,
    marginTop: -200,
    opacity: 0.5,
  },
  matchItem: {
    backgroundColor: "#fff",
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  publishLink: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    padding: 15,
  },
});

