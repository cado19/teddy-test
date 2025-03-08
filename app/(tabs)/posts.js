// app/posts.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

// Firebase
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseApp from "../../firebaseConfig";

export default function Posts() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    // If you want only the current user's posts, filter by UID
    // Otherwise, remove the "where" clause to fetch all posts
    const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let fetchedPosts = [];
        snapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0DFF9E" />
      </View>
    );
  }

  return (
    <View style={styles.topContainer}>
      {/* Top bar */}
      <View>
        <View style={styles.linkStyles}>
          <Image
            source={require("../../assets/qrimage.png")}
            style={styles.qrStyle}
          />
          {/* Menu button */}
          <Pressable
            style={styles.menuButton}
            onPress={() => navigation.navigate("desplegable")}
          >
            <FontAwesome name="bars" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Feed of posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => <PostItem item={item} navigation={navigation} />}
      />
    </View>
  );
}

// A separate component to display each post
function PostItem({ item, navigation }) {
  return (
    <View style={styles.postContainer}>
      {/* 2nd bar with user info */}
      <View style={styles.btnGroup}>
        <Image
          source={require("../../assets/anonymous_avatars_grey_circles.jpg")}
          style={styles.pfp}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userDetailsText}>
            {item.nickname || "Nickname"}
          </Text>
          <Text style={styles.userDetailsText}>
            {item.role || "Role"}
          </Text>
          <Text style={styles.userDetailsText}>
            {item.description || "Description"}
          </Text>
        </View>
        {/* Popularity button (if you have a rating system, you can show stars or a number) */}
        <Pressable style={styles.popularityBtn}>
          <Text style={styles.btnText}>POPULARITY</Text>
        </Pressable>
      </View>

      {/* The post content */}
      <View style={styles.postBox}>
        {/* If item.mediaUrl exists, show an image. Otherwise, show a placeholder. */}
        {item.mediaUrl ? (
          <Image
            source={{ uri: item.mediaUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {item.text || "No content"}
            </Text>
          </View>
        )}
      </View>

      {/* Icons for favorites/comments */}
      <View style={styles.icons}>
        <Pressable onPress={() => navigation.navigate("megusta")}>
          <FontAwesome name="star" size={30} color="white" />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("commentar")}
          style={{ marginLeft: 10 }}
        >
          <FontAwesome name="comment" size={30} color="#72009E" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  linkStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  qrStyle: {
    width: 50,
    height: 50,
  },
  menuButton: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  // Each post container
  postContainer: {
    marginBottom: 20,
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    marginLeft: 20,
  },
  pfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
  },
  userDetails: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    marginLeft: 10,
    borderRadius: 20,
    height: 100,
    justifyContent: "center",
  },
  userDetailsText: {
    fontSize: 15,
    color: "white",
  },
  popularityBtn: {
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  postBox: {
    width: "90%",
    height: 350,
    backgroundColor: "lightgray",
    margin: 15,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#72009E",
    fontWeight: "bold",
  },
  icons: {
    flexDirection: "row",
    marginTop: -20,
    marginLeft: 30,
  },
});
