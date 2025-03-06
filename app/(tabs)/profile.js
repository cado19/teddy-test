import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

// Firebase imports
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import firebaseApp from "../firebaseConfig";
=======
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {

  const [user, setUser] = useState();
  const [imageUrl, setImageUrl] = useState();

  const getUser = () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    })
  }
  
  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular
  });

export default function Publish() {
  const navigation = useNavigation();
  useEffect(() => {
    getUser();
  },[])

  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  // Helper: Pick an image from the device gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissions Required", "Please allow access to your photo library.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
      setVideoUri(null); // Clear video if image is picked
    }
  };

  // Helper: Pick a video from the device gallery
  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissions Required", "Please allow access to your photo library.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setVideoUri(result.assets[0].uri);
      setImageUri(null); // Clear image if video is picked
    }
  };

  // Helper: Upload a file (image or video) to Firebase Storage and return its URL
  const uploadFileAsync = async (uri, uid, folderName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `${folderName}/${uid}_${Date.now()}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const handlePublish = async () => {
    // Validation: Ensure at least text, image, or video is provided
    if (!text.trim() && !imageUri && !videoUri) {
      Alert.alert("Validation Error", "Please add text, an image, or a video.");
      return;
    }

    setUploading(true); // Start the loading indicator

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Authentication Error", "User is not signed in.");
        return;
      }

      let mediaUrl = "";
      let mediaType = "";

      // Upload media if available
      if (imageUri) {
        mediaType = "image";
        mediaUrl = await uploadFileAsync(imageUri, currentUser.uid, "images");
      } else if (videoUri) {
        mediaType = "video";
        mediaUrl = await uploadFileAsync(videoUri, currentUser.uid, "videos");
      }

      // Write post data to Firestore
      await addDoc(collection(firestore, "posts"), {
        uid: currentUser.uid,
        text: text.trim(),
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Post published!");
      // Redirect to profile screen
      navigation.navigate("profile");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setUploading(false); // Stop the loading indicator
    }
  };

  return (
    <View style={styles.topContainer}>
      {uploading && (
        <ActivityIndicator size="large" color="#0DFF9E" style={{ margin: 20 }} />
      )}
      <View style={styles.header}>
        <Image
          source={require("../assets/qrimage.png")}
          style={styles.qrStyle}
        />
        <Text style={styles.btnText}>PUBLISH</Text>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Pressable style={styles.menuButton}>
          <FontAwesome name="bars" size={24} color="white" />
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="gray"
        value={text}
        onChangeText={setText}
        multiline
      />

      {/* Display preview of selected media */}
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.mediaPreview}
          resizeMode="cover"
        />
      )}
      {videoUri && (
        <Text style={styles.videoPreview}>Video selected: {videoUri}</Text>
      )}

      <View style={styles.btnGroup}>
        <Pressable style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>UPLOAD PHOTO</Text>
        </Pressable>
        <Pressable style={styles.pickButton} onPress={pickVideo}>
          <Text style={styles.pickButtonText}>UPLOAD VIDEO</Text>
        </Pressable>
      </View>
      <Pressable style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.pickButtonText}>PUBLISH</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
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
    width: 50,
    height: 50,
  },
  menuButton: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    borderRadius: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "100%",
    color: "black",
  },
  mediaPreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  videoPreview: {
    color: "#0DFF9E",
    textAlign: "center",
    marginVertical: 10,
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  pickButton: {
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  publishButton: {
    backgroundColor: "#0DFF9E",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  pickButtonText: {
    color: "black",
    fontWeight: "600",
    textAlign: "center",
  },
});

