import { View, Text, StyleSheet, Image, Pressable, TextInput } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Megusta() {
 const navigation = useNavigation();
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
           <Image
             source={require("../assets/anonymous_avatars_grey_circles.jpg")}
             style={styles.pfp}
           />
           <View style={styles.userDetails}>
             <Text style={styles.userDetailsText}>Nickname</Text>
             <Text style={styles.userDetailsText}>Role</Text>
             <Text style={styles.userDetailsText}>Description</Text>
           </View>
           {/* menu button  */}
           <Pressable style={styles.popularityBtn}>
             <Text style={styles.btnText}>POPULARITY</Text>
           </Pressable>
         </View>
       </View>
 
       {/* post  */}
       <View style={styles.post}></View>
       
       <TextInput
         style={styles.input}
         placeholder="ENSCRIBE TU MESSAGE AQUL..."
         placeholderTextColor="gray"
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
 });
 