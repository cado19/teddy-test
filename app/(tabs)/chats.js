import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation, useLocalSearchParams } from "expo-router";

// Firebase
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebaseApp from "../../firebaseConfig";

export default function Chats() {
  const navigation = useNavigation();
  const route = useLocalSearchParams();

  // If you navigate to this screen with: navigation.navigate("chats", { otherUserId: ... })
  const { otherUserId } = route.params || {};

  // Load custom fonts (optional)
  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular,
  });

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Firebase
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

    // set colour scheme 
    const colorScheme = authenticatedUser?.fetish == 'bdsm' ? styles.light : styles.dark;

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }
    setAuthenticatedUser(auth.currentUser);  
    if (!otherUserId) {
      Alert.alert("Error", "No other user specified for chat.");
      return;
    }

    // Create a consistent conversation ID from the two user IDs
    const conversationId =
      currentUserId < otherUserId
        ? `${currentUserId}_${otherUserId}`
        : `${otherUserId}_${currentUserId}`;

    // Reference to messages sub-collection: "chats/{conversationId}/messages"
    const msgsRef = collection(firestore, "chats", conversationId, "messages");
    const q = query(msgsRef, orderBy("createdAt", "asc")); // oldest first

    // Listen to messages in real time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [otherUserId]);

  // Send a message
  const handleSend = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !otherUserId) return;
    if (!inputText.trim()) return; // don't send empty messages

    const conversationId =
      currentUserId < otherUserId
        ? `${currentUserId}_${otherUserId}`
        : `${otherUserId}_${currentUserId}`;

    const msgsRef = collection(firestore, "chats", conversationId, "messages");
    await addDoc(msgsRef, {
      text: inputText.trim(),
      sender: currentUserId,
      createdAt: serverTimestamp(),
    });
    setInputText("");
  };

  // Render each message bubble inside the purple chatbox
  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === auth.currentUser?.uid;
    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={[styles.topContainer, colorScheme]}>
      {/* Top Bar */}
      <View style={styles.linkStyles}>
        <Image source={require("../../assets/qrimage.png")} style={styles.qrStyle} />
        <Text style={styles.btnText}> CHATS </Text>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate("desplegable")}
        >
          <FontAwesome name="bars" size={24} color="white" />
        </Pressable>
      </View>

      {/* Purple chat view with messages */}
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.chatbox}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          // If you prefer newest at bottom, keep this normal.
          // If you want newest at top, you can do 'inverted'.
          // inverted
          contentContainerStyle={styles.messagesContainer}
        />
      </KeyboardAvoidingView>

      {/* Input & Send */}
      <View style={styles.textBox}>
        <TextInput
          style={styles.input}
          placeholder="ENSCRIBE TU MESSAGE AQUI..."
          placeholderTextColor="gray"
          value={inputText}
          onChangeText={setInputText}
        />
        <Pressable style={styles.matchBtn} onPress={handleSend}>
          <Text style={{ color: "black", fontWeight: "bold" }}>ENVIAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  qrStyle: {
    width: 50,
    height: 50,
  },
  topContainer: {
    flex: 1,
    // backgroundColor: "black",
  },
  linkStyles: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    alignItems: "center",
  },
  menuButton: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  logo: {
    height: 50,
    width: 50,
  },
  btnText: {
    color: "white",
    fontSize: 30,
    fontFamily: "Itim_400Regular",
  },

  // The purple chat area
  chatbox: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    backgroundColor: "#72009E",
    overflow: "hidden",
  },
  // Container style for the FlatList
  messagesContainer: {
    padding: 10,
  },
  // Each message bubble
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  // My messages (right side)
  myMessage: {
    backgroundColor: "#29FF9B",
    alignSelf: "flex-end",
  },
  // Other user's messages (left side)
  theirMessage: {
    backgroundColor: "#444",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
  },

  // Input area
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    color: "black",
    width: "65%",
  },
  matchBtn: {
    backgroundColor: "#29FF9B",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginLeft: 15,
  },
});
