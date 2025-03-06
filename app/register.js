import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// import firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { app, auth, firestore, storage, firebase } from "../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
// import "firebase/firestore";

export default function Register() {
  const navigation = useNavigation();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");
  const [location, setLocation] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [createdAt, setEmail] = useState('');

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

      // setImage(result.uri);
      console.log(result.assets[0].uri);
      return result.assets[0].uri;
  };

  const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage.ref.child(`profile_images/${userId}`);
    await ref.put(blob);
    return ref.getDownloadURL();
  };

  const signUpUserWithProfilePhoto = async () => {
    setLoading(true);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);
    if (password != confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    const uId = '';

    // const auth = getAuth(app);
    // const storage = getStorage();
    // const firestore = firebase.firestore();
    try {
      // create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user
      
      console.log("id: " + user.uid);
      // Select profile photo
      const image = await pickImage();
      if (image) {
        const downloadURL = await uploadImage(image, user.uid);
        await user.updateProfile({ photoURL: downloadURL });
      }

      const setUpdateRef = doc(firestore, "users", user.uid);

      // Add user document to Firestore
      await setDoc(setUpdateRef, {
        email: user.email,
        role: role,
        genderIdentity: genderIdentity,
        sexualOrientation: sexualOrientation,
        location: location,
        // profilePhotoUrl: downloadUrl,
        // createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setLoading(false);
      alert("Successfully signed up");
      navigation.navigate("universos");
    } catch (error) {
      // alert(error);
      console.log(error);
      setLoading(false);
    }
  };

  const logRender = () => {
    console.log('Rendered');
  }

  useEffect(() => {
    logRender();
  }, [user])

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
        placeholder="Confirm password"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={role}
        onChangeText={setRole}
        placeholder="Rol"
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
    borderRadius: 50, // This will make the button round
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3, // Adds a shadow effect (Android only)
    shadowColor: "#000", // Adds a shadow effect (iOS only)
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
