import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation, useRoute } from "expo-router";

// Firebase imports
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
  const route = useRoute();

  // If you navigate like: navigation.navigate("Chats", { otherUserId: "xyz" })
  // Then route.params?.otherUserId is available:
  const { otherUserId } = route.params || {};

  // Load custom fonts (optional)
  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular,
  });

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }
    if (!otherUserId) {
      // If there's no other user to chat with, we can't proceed
      return;
    }

    // Create a consistent conversation ID (smallestUID_largestUID)
    const conversationId =
      currentUserId < otherUserId
        ? `${currentUserId}_${otherUserId}`
        : `${otherUserId}_${currentUserId}`;

    // Listen to messages in "chats/{conversationId}/messages"
    const msgsRef = collection(firestore, "chats", conversationId, "messages");
    const q = query(msgsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [otherUserId]);

  // Send a new message
  const handleSend = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !otherUserId) return;
    if (!inputText.trim()) return; // no empty messages

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

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.topContainer}>
      {/* Top bar with QR, "CHATS", logo, and menu */}
      <View>
        <View style={styles.linkStyles}>
          <Image
            source={require("../../assets/qrimage.png")}
            style={styles.qrStyle}
          />
          <Text style={styles.btnText}> CHATS </Text>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Pressable
            style={styles.menuButton}
            onPress={() => navigation.navigate("desplegable")}
          >
            <FontAwesome name="bars" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Chat messages container */}
      <View style={styles.chatbox}>
        <FlatList
          data={messages}
          inverted // newest at bottom
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
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
          }}
        />
      </View>

      {/* Input area */}
      <View style={styles.textBox}>
        <TextInput
          style={styles.input}
          placeholder="ESCRIBE TU MENSAJE AQUÍ..."
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

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: "black",
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
    color: "white",
    fontSize: 30,
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
  chatbox: {
    flex: 1, // let the chatbox fill available space
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    backgroundColor: "#72009E",
    padding: 10,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#29FF9B",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
  },
  messageText: {
    color: "white",
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    color: "black",
    width: "70%",
  },
  matchBtn: {
    backgroundColor: "#29FF9B",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginLeft: 15,
  },
});

