import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebaseConfig.js";
// import { signInWithEmailAndPassword } from "@react-native-firebase/auth";
// import auth from "@react-native-firebase/auth";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const auth = getAuth(app);
    try {
      signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then((res) => {
        const user = res.user;
        // console.log(res.user);
        alert("Successfully logged in");
        // alert("Sign in success");
        navigation.navigate("(tabs)");
        setLoading(false);
      });
    } catch (error) {
      alert(error.code);
      console.log(error.code);
      if(error.code === 'auth/wrong-password'){
        alert("Incorrect password. Please try again.");
      } else {
        alert("Sign in failed" + error.message);
        console.log(error.message);
      }
    } 
    
    
  };

  return (
    <View style={styles.container}>
      
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="gray"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="gray"
        />
        {loading ? (
          <ActivityIndicator size={"small"} style={{ margin: 28 }} />
        ) : (
          <Pressable style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        )}
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "80%",
    color: "black",
  },
  button: {
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
