import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app, auth, firestore, storage } from "../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState(""); // New field for matching
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick an image from the library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      console.log("Selected image uri:", result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  };

  // Upload image and return download URL
  const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_images/${userId}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const signUpUserWithProfilePhoto = async () => {
    setLoading(true);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User id:", user.uid);

      // Pick profile photo and upload it
      const imageUri = await pickImage();
      let downloadURL = "";
      if (imageUri) {
        downloadURL = await uploadImage(imageUri, user.uid);
      }

      // Create a reference for the user document in Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      
      // Convert interests string into an array (trim and filter out empty strings)
      const interestsArray = interests
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

      // Add user document to Firestore with all required fields for matching
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: role,
        genderIdentity: genderIdentity,
        sexualOrientation: sexualOrientation,
        location: location,
        interests: interestsArray, // New field used for matching
        profilePhotoUrl: downloadURL || "", // Use downloaded URL if available
        // createdAt: serverTimestamp(), // Optionally add a timestamp
      });
      setLoading(false);
      alert("Successfully signed up");
      navigation.navigate("universos");
    } catch (error) {
      console.log("Registration error:", error);
      setLoading(false);
    }
  };

  const logRender = () => {
    console.log("Rendered");
  };

  useEffect(() => {
    logRender();
  }, [user]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={role}
        onChangeText={setRole}
        placeholder="Role"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={genderIdentity}
        onChangeText={setGenderIdentity}
        placeholder="Gender Identity"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={sexualOrientation}
        onChangeText={setSexualOrientation}
        placeholder="Sexual Orientation"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        placeholderTextColor="gray"
      />
      {/* New Interests Input Field */}
      <TextInput
        style={styles.input}
        value={interests}
        onChangeText={setInterests}
        placeholder="Interests (comma-separated)"
        placeholderTextColor="gray"
      />

      <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
        <Text style={styles.btnText}>Photo</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size={"small"} style={{ margin: 28 }} />
      ) : (
        <Pressable style={styles.button} onPress={signUpUserWithProfilePhoto}>
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
  photoBtn: {
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  btnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
