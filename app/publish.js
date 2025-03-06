import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Firebase imports
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebaseApp from "../firebaseConfig"; // Adjust if needed
import { useNavigation } from "@react-navigation/native";

export default function Publish() {
  const navigation = useNavigation();

  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  // Helper to pick image
  const pickImage = async () => {
    // Request media library permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissions Required", "You need to allow camera roll permissions to pick an image.");
      return;
    }

    // Launch image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
      setVideoUri(null); // clear video if new image picked
    }
  };

  // Helper to pick video
  const pickVideo = async () => {
    // Request media library permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissions Required", "You need to allow camera roll permissions to pick a video.");
      return;
    }

    // Launch video library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setVideoUri(result.assets[0].uri);
      setImageUri(null); // clear image if new video picked
    }
  };

  // Helper to remove selected media
  const removeMedia = () => {
    setImageUri(null);
    setVideoUri(null);
  };

  const handlePublish = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not Authenticated", "Please sign in first.");
      return;
    }

    let mediaUrl = null;
    let mediaType = null;

    try {
      // If user picked an image or video, upload to Firebase Storage
      if (imageUri) {
        mediaType = "image";
        mediaUrl = await uploadFileAsync(imageUri, user.uid, "images");
      } else if (videoUri) {
        mediaType = "video";
        mediaUrl = await uploadFileAsync(videoUri, user.uid, "videos");
      }

      // Create a new post in Firestore
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        text: text,
        mediaUrl: mediaUrl || "",
        mediaType: mediaType || "",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Post published!");
      // Navigate back to the profile screen
      navigation.navigate("profile"); 
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    }
  };

  // Upload file to Firebase Storage and return the download URL
  const uploadFileAsync = async (uri, uid, folderName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `${folderName}/${uid}_${Date.now()}`);
    await uploadBytes(storageRef, blob);

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  return (
    <View style={styles.topContainer}>
      {/* Header row */}
      <View style={styles.linkStyles}>
        <Image source={require("../assets/qrimage.png")} style={styles.qrStyle} />
        <Text style={styles.btnText}>PUBLISH</Text>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Pressable style={styles.menuButton}>
          <FontAwesome name="bars" size={24} color="white" />
        </Pressable>
      </View>

      {/* Post text input */}
      <View style={{ alignItems: "center" }}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
          multiline
        />
      </View>

      {/* Display picked image or video thumbnail */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, alignSelf: "center", margin: 10 }} />
      )}
      {videoUri && (
        <Text style={{ color: "#0DFF9E", textAlign: "center", margin: 10 }}>
          Video selected: {videoUri}
        </Text>
      )}

      {/* Button group for picking image/video */}
      <View style={styles.btnGroup}>
        <View style={styles.subBtnGroup}>
          <Pressable style={styles.pickButton} onPress={pickImage}>
            <Text style={styles.pickButtonText}>UPLOAD PHOTO</Text>
          </Pressable>
          <Pressable style={styles.pickButton} onPress={pickVideo}>
            <Text style={styles.pickButtonText}>UPLOAD VIDEO</Text>
          </Pressable>
          <Pressable style={styles.removeButton} onPress={removeMedia}>
            <Text style={styles.pickButtonText}>REMOVE MEDIA</Text>
          </Pressable>
        </View>
        <Pressable style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.pickButtonText}>PUBLISH</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 50,
  },
  linkStyles: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
  qrStyle: {
    width: 50,
    height: 50,
  },
  btnText: {
    fontSize: 30,
    color: "white",
    fontFamily: "Itim_400Regular",
  },
  logo: {
    height: 50,
    width: 50,
  },
  menuButton: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "80%",
    color: "black",
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    alignItems: "center",
  },
  subBtnGroup: {
    flexDirection: "row",
  },
  pickButton: {
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  publishButton: {
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  removeButton: {
    backgroundColor: "red",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  pickButtonText: {
    color: "black",
    fontWeight: "600",
  },
});
