import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function TabLayout() {
  const [currentUser, setCurrentUser] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  };

  const fetchCurrentUser = async () => {
    const docRef = doc(firestore, "users", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      setCurrentUser(docSnap.data());
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    fetchCurrentUser();
  }, [])

  if(!loading){
    console.log(currentUser);
     return (
    <Tabs
      initialRouteName="profile"
      screenOptions={{ tabBarStyle: { backgroundColor: currentUser.fetish === 'bdsm' ? '#ffffff' : '#000000' } }}
    >
      <Tabs.Screen
        name="reels"
        options={{
          title: "Reels",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/recurso_2.png")}
              style={styles.images}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Posts",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/recurso_1.png")}
              style={styles.images}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/recurso_5.png")}
              style={styles.images}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/recurso_3.png")}
              style={styles.images}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/recurso_4.png")}
              style={styles.images}
            />
          ),
        }}
      />
    </Tabs>
  );
  }
 
}

const styles = StyleSheet.create({
  images: {
    height: 40,
    width: 40,
    marginBottom: 10,
  },
});
