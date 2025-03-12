import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { auth, firestore, storage } from "../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av"; 

export default function Commentar({ route }) {
  const { postID } = useLocalSearchParams();
  const [post, setPost] = useState();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const getPost = async () => {
    const docRef = doc(firestore, "posts", postID);
    try {
      const docSnap = await getDoc(docRef);
      setPost(docSnap.data());
      setPending(true);
      setLoading(false);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const getComments = async () => {
    const commentData = [];
    const q = query(
      collection(firestore, "comments"),
      where("postID", "==", postID)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      commentData.push({
        ...doc.data(),
        key: doc.id,
      });
    });
    setComments(commentData);
  };

  const addComment = async () => {
    console.log(user.uid);
    const commentData = {
      postID: postID,
      uid: user.uid,
      text: comment,
    };
    try {
      await addDoc(collection(firestore, "comments"), commentData);
      setComment("");
      setPending(true);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  // console.log(post);

  const fetchCurrentUser = async () => {
    // console.log("got here");
    // console.log(user);
    const docRef = doc(firestore, "users", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      // console.log(docSnap.data())
      setCurrentUser(docSnap.data());
      setPending(true);
      // console.log(docSnap.data())
      const storageRef = ref(storage, currentUser?.profilePhotoUrl);
      try {
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
        setLoading(false);
        setPending(false);
        // console.log("Image url: " + imageUrl);
      } catch (error) {
        console.log("URL error: " + error);
        setLoading(false);
      }
      // setLoading(false);
    } catch (error) {
      console.log("docsnap error: " + error);
      setLoading(false);
    }
    setPending(true);
  };
  const getUser = () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);

      // fetchCurrentUser(user);
      // console.log(user);
      setPending(false);
    });
  };

  useEffect(() => {
    getUser();
    fetchCurrentUser();
    getPost();
    getComments();
  }, [pending]);

  // if (post) {
  //   console.log(post);
  // }

  const navigation = useNavigation();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  return (
    <View style={styles.topContainer}>
      {/* top bar  */}
      <View>
        <View className="flex">
          {/* qrcode  */}
          <View style={styles.linkStyles}>
            <Image
              source={require("../assets/qrimage.png")}
              style={styles.qrStyle}
            />
            {/* menu button  */}
            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("desplegable")}
            >
              <FontAwesome name="bars" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* 2nd bar  */}
      <View style={styles.btnParent}>
        <View style={styles.btnGroup}>
          <Image source={{ uri: imageUrl }} style={styles.pfp} />
          <View style={styles.userDetails}>
            <Text style={styles.userDetailsText}>{currentUser?.nickname}</Text>
            <Text style={styles.userDetailsText}>{currentUser?.role}</Text>
            <Text style={styles.userDetailsText}>
              {currentUser?.description}
            </Text>
          </View>
          {/* menu button  */}
          <Pressable style={styles.popularityBtn}>
            <Image
              source={require("../assets/5_stars.png")}
              style={{ width: 50, height: 50, margin: 0, padding: 0, zoom: 5 }}
            />
            <Text style={styles.btnText}>POPULARITY</Text>
          </Pressable>
        </View>
      </View>

      {/* post  */}
      {post.mediaType == "video" ? (
        <Video
          source={{ uri: post.mediaUrl }}
          rate={1.0}
          isMuted={false}
          resizeMode="cover"
          useNativeControls
          style={styles.post}
          controls
        />
      ) : (
        <Image src={post.mediaUrl} style={styles.post} />
      )}
      {/* icons for comments and favourites  */}
      <View style={styles.icons}>
        <Pressable onPress={() => navigation.navigate("")}>
          <FontAwesome name="star" size={30} color="white" />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("")}
          style={{ marginLeft: 10 }}
        >
          <FontAwesome name="comment" size={30} color="#72009E" />
        </Pressable>
      </View>
      <View style={{ backgroundColor: "white", color: "blue" }}>
        <Text style={{ textAlign: "center" }}>{post.text}</Text>
      </View>
      
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.cmntContainer}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.commentContainer}>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="ENSCRIBE TU MESSAGE AQUL..."
          placeholderTextColor="gray"
        />
        <Pressable onPress={addComment} style={styles.commentBtn}>
          <Text style={styles.userDetailsText}>Comment</Text>
        </Pressable>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  qrStyle: {
    width: 50,
    height: 50,
  },
  topContainer: {
    flex: 1,
    backgroundColor: "black",
    // justifyContent: "center",
    // alignItems: "center",
  },
  linkStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    // width: "80%",
  },
  menuButton: {
    backgroundColor: "#0DFF9E",
    padding: 15,
    borderRadius: 50, // Makes the button rounded
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  btnParent: {
    alignItems: "center",
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 40,
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
  },
  userDetailsText: {
    fontFamily: "Itim_400Regular",
    fontSize: 15,
    color: "white",
  },
  popularityBtn: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#72009E",
    padding: 15,
    borderRadius: 25,
    // width: "45%",
    alignItems: "center",
  },
  post: {
    width: 370,
    height: 350,
    backgroundColor: "lightgray",
    margin: 15,
  },
  icons: {
    flexDirection: "row",
    marginTop: -20,
    marginLeft: 30,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    // width: "80%",
    color: "black",
  },
  text: {
    color: "black",
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 25,
  },
  commentBtn: {
    backgroundColor: "#72009E",
    padding: 10,
    borderRadius: 25,
  },

  cmntContainer: {
    margin: 5,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "white",
    color: "blue",
  }
});
