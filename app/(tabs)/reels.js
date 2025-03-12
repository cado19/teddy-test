import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { ref, getDownloadURL } from "firebase/storage";
// import Video from 'react-native-video';
import { Video } from "expo-av";

export default function Reels() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const colorScheme = currentUser?.fetish == 'bdsm' ? styles.light : styles.dark;
  
  const getPosts = async () => {
    setPending(false);
    const postData = [];
    const q = query(
      collection(firestore, "posts"),
      where("mediaType", "==", "video")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      // addPostData(doc);
      postData.push({
        ...doc.data(),
        key: doc.id,
      });
      setPosts(postData);
    });
    setPending(false);
  };

  const fetchCurrentUser = async () => {
    //  console.log("got here");
    //  console.log(user);
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
        console.log("Image url: " + imageUrl);
      } catch (error) {
        console.log("URL error: " + error);
        setLoading(true);
      }
      // setLoading(false);
    } catch (error) {
      console.log("docsnap error: " + error);
      setLoading(false);
    }
    setPending(true);
    // if (docSnap.exists()) {
    //   setCurrentUser(docSnap.data());
    //   console.log(docSnap.data())
    //   const storageRef = ref(storage, currentUser?.profilePhotoUrl);
    //   try {
    //     const url = await getDownloadURL(storageRef);
    //   } catch (error) {
    //     console.log("URL error: " + error);
    //     setLoading(false);
    //   }
    //   setImageUrl(url);
    //   setLoading(false);
    // } else {
    //   console.log("no such document");
    // }
  };
  const getUser = () => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setPending(false);
    });
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

  const navigation = useNavigation();

  useEffect(() => {
    getUser();
    // fetchPfp();
    fetchCurrentUser();
    getPosts();
  }, [posts]);
  // if (currentUser) {
  //   console.log(currentUser);
  // }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

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
      <View>
        <View className="flex">
          {/* qrcode  */}
          <View style={styles.linkStyles}>
            <Image
              source={require("../../assets/qrimage.png")}
              style={styles.qrStyle}
            />
            <Image source={{ uri: imageUrl }} style={styles.pfp} />
            {/* Logo  */}
            <View style={styles.userDetails}>
              <Text style={styles.userDetailsText}>
                {currentUser?.nickname}
              </Text>
              <Text style={styles.userDetailsText}>{currentUser?.role}</Text>
              <Text style={styles.userDetailsText}>
                {currentUser?.description}
              </Text>
            </View>
            {/* menu button  */}
            <Pressable style={styles.popularityBtn}>
              <Image
                source={require("../../assets/5_stars.png")}
                style={{
                  width: 50,
                  height: 50,
                  margin: 0,
                  padding: 0,
                  zoom: 5,
                }}
              />
              <Text style={styles.btnText}>POPULARITY</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {/* <View style={styles.reel}></View> */}
      <FlatList
        data={posts}
        renderItem={({ item, index }) => (
          <View style={{ height: 800 }}>
            <Video
              source={{ uri: item.mediaUrl }}
              rate={1.0}
              isMuted={false}
              resizeMode="cover"
              useNativeControls
              shouldPlay={index === currentIndex}
              style={styles.reel}
              controls
            />
            <Pressable
              onPress={() => navigation.navigate("publish")}
              style={styles.publishLink}
              className="text-center"
            >
              <FontAwesome name="plus" size={25} color="white" />
            </Pressable>
          </View>
        )}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: "black",
    // justifyContent: "center",
    // alignItems: "center",
  },
  qrStyle: {
    width: 50,
    height: 50,
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
  userDiv: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    gap: 10,
  },
  pfp: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
  },
  userDetails: {
    backgroundColor: "#0DFF9E",
    padding: 10,
    marginLeft: 10,
    borderRadius: 20,
    // height: 50,
    width: "30%",
  },
  userDetailsText: {
    fontFamily: "Itim_400Regular",
    fontSize: 7,
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
  reel: {
    width: "100%",
    height: "70%",
    // backgroundColor: "lightgray",
    // margin: 15,
  },
  publishLink: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dark: {
    backgroundColor: '#000000'
  },
  light: {
    backgroundColor: '#FFFFFF'
  },
});
