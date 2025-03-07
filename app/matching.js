import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert } from "react-native";
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
import firebaseApp from "../firebaseConfig";

export default function Matching() {
  const navigation = useNavigation();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated.");
      setLoading(false);
      return;
    }
    // Directly get the user's document using their UID
    const userDocRef = doc(firestore, "users", currentUser.uid);
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const currentUserProfile = docSnap.data();
          console.log("Current user profile:", currentUserProfile);
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
    if (currentUserProfile.interests && currentUserProfile.interests.length > 0) {
      matchesQuery = query(
        collection(firestore, "users"),
        where("location", "==", currentUserProfile.location),
        where("interests", "array-contains-any", currentUserProfile.interests.slice(0, 10))
      );
    } else {
      matchesQuery = query(
        collection(firestore, "users"),
        where("location", "==", currentUserProfile.location)
      );
    }

    const unsubscribeMatches = onSnapshot(
      matchesQuery,
      (snapshot) => {
        let candidates = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.uid !== currentUserProfile.uid) {
            candidates.push(data);
          }
        });
        console.log("Potential matches:", candidates);
        setPotentialMatches(candidates);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    );
    return () => unsubscribeMatches();
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
      Alert.alert("Match Success!", `You matched with ${matchedUser.nickname}.`);
      navigation.navigate("Matches");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0DFF9E" />
      </View>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.textStyle}>No potential matches found.</Text>
      </View>
    );
  }

  const userToShow = potentialMatches[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <Image source={require("../../assets/qrimage.png")} style={styles.qrStyle} />
        <Text style={styles.titleText}>MATCHING</Text>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Pressable style={styles.menuButton} onPress={() => navigation.navigate("desplegable")}>
          <Image source={require("../../assets/menu.png")} style={styles.menuIcon} />
        </Pressable>
      </View>

      {/* Match Card */}
      <View style={styles.card}>
        <Text style={styles.nickname}>{userToShow.nickname || "NICKNAME"}</Text>
        <Text style={styles.info}>{userToShow.role || "ROLE"}</Text>
        <Text style={styles.info}>{userToShow.description || "DESCRIPTION"}</Text>
        {userToShow.photoUrl && (
          <Image source={{ uri: userToShow.photoUrl }} style={styles.profilePic} />
        )}
      </View>

      {/* Bottom buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>NEXT</Text>
        </Pressable>
        <Pressable style={styles.matchButton} onPress={handleMatch}>
          <Text style={styles.buttonText}>MATCH</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "black", paddingTop: 40, paddingHorizontal: 10,
  },
  centered: {
    flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center",
  },
  textStyle: {
    color: "white", fontSize: 16,
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20,
  },
  qrStyle: {
    width: 50, height: 50,
  },
  titleText: {
    color: "#0DFF9E", fontSize: 24, fontWeight: "bold",
  },
  logo: {
    width: 50, height: 50,
  },
  menuButton: {
    backgroundColor: "#0DFF9E", padding: 10, borderRadius: 50,
  },
  menuIcon: {
    width: 24, height: 24, tintColor: "white",
  },
  card: {
    backgroundColor: "#1E1E1E", borderRadius: 20, padding: 20, alignItems: "center", marginBottom: 20,
  },
  nickname: {
    color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 10,
  },
  info: {
    color: "white", fontSize: 16, marginBottom: 5,
  },
  profilePic: {
    width: 100, height: 100, borderRadius: 50, marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row", justifyContent: "space-between",
  },
  nextButton: {
    flex: 1, backgroundColor: "purple", padding: 15, borderRadius: 10, marginRight: 5, alignItems: "center",
  },
  matchButton: {
    flex: 1, backgroundColor: "#29FF9B", padding: 15, borderRadius: 10, marginLeft: 5, alignItems: "center",
  },
  buttonText: {
    color: "white", fontWeight: "bold",
  },
});
