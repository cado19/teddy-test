import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Itim_400Regular, Inter_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "expo-router";
import { auth, firestore, storage } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AppLoading from "expo-app-loading";
import { ref, getDownloadURL } from "firebase/storage";

export default function Posts() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [posts, setPosts] = useState([]);

  // const postData = [];

  // const addPostData = (post) => {
  //   postData.push({
  //     id: post.id,
  //     mediaType: post.data().mediaType,
  //     mediaUrl: post.data().mediaUrl,
  //     text: post.data().text,
  //     uid: post.data().uid
  //   })
  // }

  const colorScheme = currentUser?.fetish == 'bdsm' ? styles.light : styles.dark;

  useEffect(() => {
    getUser();
    // fetchPfp();
    fetchCurrentUser();
    getPosts();
  }, [pending]);

  const getPosts = async () => {
    setPending(false);
    const postData = [];
    const q = query(
      collection(firestore, "posts"),
      where("mediaType", "==", "image")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      // addPostData(doc);
      postData.push({
        ...doc.data(),
        key: doc.id,
      });
      setPosts(postData);
    });
    setPending(true);
  };

  const getUser = () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      // console.log("User: " + user);
      setPending(false);
    });
  };

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
        setPending(true);
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

  const fetchPfp = async () => {
    try {
      const storageRef = ref(storage, currentUser?.profilePhotoUrl);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_400Regular,
  });

  // if (currentUser) {
  //   console.log(currentUser);
  // }

  if (posts) {
    console.log(posts);
  }

  if (loading) {
    return (
      <View
        style={[{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }, colorScheme]}
      >
        <ActivityIndicator size={"large"} style={{ margin: 28 }} />
      </View>
    );
  }

  return (
    <View style={[styles.topContainer, colorScheme]}>
      {/* top bar  */}
      <View>
        <View className="flex">
          {/* qrcode  */}
          <View style={styles.linkStyles}>
            <Image
              source={require("../../assets/qrimage.png")}
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
            <Text style={styles.userDetailsText}>{currentUser?.description}</Text>
          </View>
          {/* menu button  */}
          <Pressable style={styles.popularityBtn}>
            <Image
              source={require("../../assets/5_stars.png")}
              style={{ width: 50, height: 50, margin: 0, padding: 0, zoom: 5 }}
            />
            <Text style={styles.btnText}>POPULARITY</Text>
          </Pressable>
        </View>
      </View>

      {/* post  */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={{ margin: 5, padding: 5 }}>
            <View>
              <Image src={item.mediaUrl} style={styles.post} />
            </View>
            {/* icons for comments and favourites  */}
            <View style={styles.icons}>
              <Pressable onPress={() => navigation.navigate("megusta")}>
                <FontAwesome name="star" size={30} color="white" />
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate("commentar", { postID: item.key })
                }
                style={{ marginLeft: 10 }}
              >
                <FontAwesome name="comment" size={30} color="#72009E" />
              </Pressable>
            </View>
            <View style={{ backgroundColor: "white", color: "blue" }}>
              <Text style={{ textAlign: "center" }}>{item.text}</Text>
            </View>
          </View>
        )}
      />
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
    // backgroundColor: "black",
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
    // height: 100,
    width: "35%"
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
    // backgroundColor: "lightgray",
    margin: 15,
  },
  icons: {
    flexDirection: "row",
    marginTop: -20,
    marginLeft: 30,
  },
  dark: {
    backgroundColor: '#000000'
  },
  light: {
    backgroundColor: '#FFFFFF'
  },
});
