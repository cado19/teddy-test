import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app, auth, firestore, storage } from "../firebaseConfig.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ScrollView } from "react-native";
import { genders, options } from "../components/options.js";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";

export default function Register() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState(""); // New interests field (comma-separated)
  const [practices, setPractices] = useState(""); // New practices field (comma-separated)
  const [selectedOptions, setSelectedOptions] = useState([]); //options box for kinks
  const [description, setDescription] = useState("");
  const [nickName, setNickName] = useState("");
  const [loading, setLoading] = useState(false);

  // Launch the image library and return the selected image URI
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

  // Upload image to Firebase Storage and return the download URL
  const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_images/${userId}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const toggleOption = (option) => {
    if (selectedOptions.includes(option.label)) {
      setSelectedOptions(
        selectedOptions.filter((label) => label !== option.label)
      );
    } else {
      setSelectedOptions([...selectedOptions, option.label]);
    }
  };

  const isSelected = (option) => selectedOptions.includes(option.label);

  const signUpUserWithProfilePhoto = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User id:", user.uid);

      // Pick and upload profile photo
      let downloadURL = "";
      const imageUri = await pickImage();
      if (imageUri) {
        downloadURL = await uploadImage(imageUri, user.uid);
      }

      // Convert interests string into an array (trim and filter out empties)
      const interestsArray = interests
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // Convert practices string into an array (trim and filter out empties)
      const practicesArray = practices
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // Save user profile to Firestore with document ID equal to user.uid
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: role,
        genderIdentity: genderIdentity,
        sexualOrientation: sexualOrientation,
        location: location,
        interests: selectedOptions,
        // interests: practicesArray,
        nickname: nickName,
        description: description,
        profilePhotoUrl: downloadURL || "",
        createdAt: serverTimestamp(),
      });
      setLoading(false);
      alert("Successfully signed up");
      navigation.navigate("universos");
    } catch (error) {
      console.log("Registration error:", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={nickName}
          onChangeText={setNickName}
          placeholder="Nickname"
          placeholderTextColor="gray"
        />
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
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="Role"
          placeholderTextColor="gray"
        />
        {/* <TextInput
          style={styles.input}
          value={genderIdentity}
          onChangeText={setGenderIdentity}
          placeholder="Gender Identity"
          placeholderTextColor="gray"
        /> */}
        <Picker
          items={genders}
          selectedValue={genderIdentity}
          onValueChange={(value) => setGenderIdentity(value)}
          // placeholder={{ label: "Select an option...", value: null }}
          style={{ color: "black", width: "80%", backgroundColor: "white", borderRadius: 25 }}
        >
          {genders.map((gender) => (
            <Picker.Item label={gender.label} value={gender.value} />))}
        </Picker>

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
        {/* <TextInput style={styles.input} value={interests} onChangeText={setInterests} placeholder="Interests (comma-separated)" placeholderTextColor="gray" /> */}
        <FlatList
          data={options}
          renderItem={({ item }) => (
            <View style={styles.optionContainer}>
              <Checkbox
                value={isSelected(item)}
                onValueChange={() => toggleOption(item)}
              />
              <Text style={styles.optionLabel}>{item.label}</Text>
            </View>
          )}
        />
        {/* <TextInput style={styles.input} value={practices} onChangeText={setPractices} placeholder="Practices (comma-separated)" placeholderTextColor="gray" /> */}
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
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
    </ScrollView>
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

  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  optionLabel: {
    marginLeft: 10,
    color: "#fff",
  },
});
