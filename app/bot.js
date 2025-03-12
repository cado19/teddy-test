import { View, Text, ActivityIndicator, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { fetchChatResponse } from "../components/deepseekServices.js";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";


export default function Bot() {
  const [chatResponse, setchatResponse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const response = await fetchChatResponse(message);
      setchatResponse(response.messages[0]?.content || "No response");
    } catch (error) {
        setchatResponse("An error occurred. Please try again.");
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.topContainer}>
      {/* Top Bar */}
      <View style={styles.linkStyles}>
        <Image
          source={require("../assets/qrimage.png")}
          style={styles.qrStyle}
        />
        <Text style={styles.btnText}> CHATS </Text>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
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
        
        <View style={styles.messagesContainer}>
            <Text style={styles.messageText}>{chatResponse}</Text>
        </View>
      </KeyboardAvoidingView>

      {/* Input & Send */}
      <View style={styles.textBox}>
        <TextInput
          style={styles.input}
          placeholder="ENSCRIBE TU MESSAGE AQUI..."
          placeholderTextColor="gray"
          value={message}
          onChangeText={setMessage}
        />
        {loading ? (
          <ActivityIndicator size={"small"} style={{ padding: 15 }} />
        ) : (
          <Pressable style={styles.matchBtn} onPress={handleSendMessage}>
            <Text style={{ color: "black", fontWeight: "bold" }}>ENVIAR</Text>
          </Pressable>
        )}
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
    backgroundColor: "black",
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