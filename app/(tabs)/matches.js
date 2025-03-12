// app/Matching.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebaseApp from "../../firebaseConfig";

// For gradient borders
import { LinearGradient } from "expo-linear-gradient";

// Example icons from @expo/vector-icons or any library you prefer
import { FontAwesome } from "@expo/vector-icons";

export default function Matching() {
  const navigation = useNavigation();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState();

  
  const colorScheme = authenticatedUser?.fetish == 'bdsm' ? styles.light : styles.dark;
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated.");
      setLoading(false);
      return;
    }
    setAuthenticatedUser(currentUser);
    // Fetch current user's doc directly by UID
    const userDocRef = doc(firestore, "users", currentUser.uid);
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const currentUserProfile = docSnap.data();
          setUser(currentUserProfile);
          fetchPotentialMatches(currentUserProfile);
        } else {
          setLoading(false);
          Alert.alert("Error", "No profile found for current user.");
        }
      })
      .catch((error) => {
        console.error("Error getting user doc:", error);
        setLoading(false);
      });
  }, []);

  const fetchPotentialMatches = (currentUserProfile) => {
    let matchesQuery;
    if (
      currentUserProfile.interests &&
      currentUserProfile.interests.length > 0
    ) {
      matchesQuery = query(
        collection(firestore, "users"),
        where("location", "==", currentUserProfile.location),
        where(
          "interests",
          "array-contains-any",
          currentUserProfile.interests.slice(0, 10)
        )
      );
    } else {
      matchesQuery = query(
        collection(firestore, "users"),
        where("location", "==", currentUserProfile.location)
      );
    }

    const unsubscribe = onSnapshot(
      matchesQuery,
      (snapshot) => {
        let candidates = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Exclude the current user
          if (data.uid !== currentUserProfile.uid) {
            candidates.push(data);
          }
        });
        setPotentialMatches(candidates);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  };

  const handleNext = () => {
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("End of List", "No more potential matches available.");
    }
  };

  const handleMatch = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }
    const matchedUser = potentialMatches[currentIndex];
    try {
      await addDoc(collection(firestore, "matches"), {
        user1: currentUser.uid,
        user2: matchedUser.uid,
        matchedAt: serverTimestamp(),
      });
      Alert.alert(
        "Match Success!",
        `You matched with ${matchedUser.nickname}.`
      );
      navigation.navigate("Matches");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, colorScheme]}>
        <ActivityIndicator size="large" color="#0DFF9E" />
      </View>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <View style={[styles.centered, colorScheme]}>
        <Text style={styles.noMatchesText}>No potential matches found.</Text>
      </View>
    );
  }

  const userToShow = potentialMatches[currentIndex];

  return (
    <View style={[styles.container, colorScheme]}>
      {/* Super top bar  */}
  
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: Popularity */}
        <Pressable style={styles.popularityButton}>
          <Text style={styles.topBarText}>POPULARITY</Text>
        </Pressable>

        {/* Center: Nickname */}
        <Text style={styles.topBarNickname}>
          {userToShow.nickname?.toUpperCase() || "NICKNAME"}
        </Text>

        {/* Right: Menu */}
        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate("desplegable")}
        >
          <FontAwesome name="bars" size={24} color="white" />
        </Pressable>
      </View>

      {/* Big Card with Gradient Border */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={["#72009E", "#0DFF9E"]} // Example teal/purple gradient
          style={styles.gradientBorder}
        >
          <View style={styles.innerCard}>
            {/* Display user info */}
            {/* Large black area for user’s photo or profile details */}
            {userToShow.profilePhotoUrl ? (
              <Image
                source={{ uri: userToShow.profilePhotoUrl }}
                style={styles.profilePic}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.emptyProfilePic}>
                <Text style={styles.emptyPicText}>No Photo</Text>
              </View>
            )}
            <Text style={styles.userDetails}>
              {userToShow.role || "ROLE"}
              {"\n"}
              {userToShow.description || "DESCRIPTION"}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Controls: NEXT - Heart Icon - MATCH */}
      <View style={styles.bottomControls}>
        {/* NEXT Button */}
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <FontAwesome name="times" size={28} color="white" />
          <Text style={styles.controlText}>NEXT</Text>
        </Pressable>

        {/* Heart icon in the center */}
        <View style={styles.heartContainer}>
          <FontAwesome name="heart" size={28} color="#0DFF9E" />
        </View>

        {/* MATCH Button */}
        <Pressable style={styles.matchButton} onPress={handleMatch}>
          <FontAwesome name="star" size={28} color="white" />
          <Text style={styles.controlText}>MATCH</Text>
        </Pressable>
      </View>

      {/* Optional Bottom Nav Icons */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <FontAwesome name="camera" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <FontAwesome name="home" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <FontAwesome name="heart" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <FontAwesome name="comment" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <FontAwesome name="user" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "black",
  },
  centered: {
    flex: 1,
    // backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  noMatchesText: {
    color: "white",
    fontSize: 16,
  },
  /* Top Bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  popularityButton: {
    borderColor: "#0DFF9E",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  topBarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  topBarNickname: {
    color: "#0DFF9E",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuButton: {
    backgroundColor: "#29FF9B",
    borderRadius: 20,
    padding: 10,
  },
  /* Gradient Card */
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 4, // space for gradient border
  },
  innerCard: {
    backgroundColor: "black",
    borderRadius: 16,
    width: 300,
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  emptyProfilePic: {
    width: 200,
    height: 200,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyPicText: {
    color: "white",
  },
  userDetails: {
    color: "#0DFF9E",
    textAlign: "center",
  },
  /* Bottom Controls */
  bottomControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 40,
    marginBottom: 10,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "purple",
    padding: 10,
    borderRadius: 25,
  },
  matchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#72009E",
    padding: 10,
    borderRadius: 25,
  },
  controlText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
  heartContainer: {
    padding: 10,
  },
  /* Bottom Nav Icons */
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "black",
    // position: "absolute", bottom: 0, left: 0, right: 0, // If you want it pinned
  },
  navItem: {
    padding: 5,
  },
  dark: {
    backgroundColor: '#000000'
  },
  light: {
    backgroundColor: '#FFFFFF'
  },
});

//////////////
