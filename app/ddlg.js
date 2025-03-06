import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router';

export default function Ddlg() {
    const navigation = useNavigation();
  return (
    <ImageBackground source={require("../assets/ddlg.jpg")} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigation.navigate("(tabs)")}>
        <Text style={styles.buttonText}>ENTER THE UNIVERSE</Text>
      </Pressable>
    </View>
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#29FF9B',
      padding: 15,
      borderRadius: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    }
});