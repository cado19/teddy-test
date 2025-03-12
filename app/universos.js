import { View, Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { GochiHand_400Regular } from "@expo-google-fonts/dev";
import AppLoading from "expo-app-loading";
import { useNavigation } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Universos() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  // const docRef = doc(firestore, "users", user?.uid);

  if(user){console.log(user)}

  const submitBdsm = async () => {
    try {
      const docRef = doc(firestore, "users", user?.uid);
      await updateDoc(docRef, {fetish: 'bdsm'}, {merge: true});
      navigation.navigate("bdsm");
    } catch (error){
      console.log(error);
    }
  }

  const submitDdlg = async () => {
    try {
      const docRef = doc(firestore, "users", user?.uid);
      await updateDoc(docRef, {fetish: 'ddlg'}, {merge: true});
      navigation.navigate("ddlg");
    } catch (error){
      console.log(error);
    }
  }

  const getUser = async () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }

  useEffect(() => {
    getUser();
  }, [])

  let [fontsLoaded] = useFonts({
    GochiHand_400Regular,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size={"large"} color={"#ffffff"} />;
  }

  if(loading){
    return <ActivityIndicator size={"large"} color={"#ffffff"} />
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.bdsmButton}
          onPress={submitBdsm}
        >
          <Text style={styles.buttonText}>BDSM</Text>
        </Pressable>
        <Pressable
          style={styles.ddlgButton}
          onPress={submitDdlg}
        >
          <Text style={styles.buttonText}>DDLG</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202020",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  bdsmButton: {
    fontFamily: "GochiHand_400Regular",
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  ddlgButton: {
    fontFamily: "GochiHand_400Regular",
    backgroundColor: "#29FF9B",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "GochiHand_400Regular",
    color: "white",
    fontSize: 18,
  },
});
