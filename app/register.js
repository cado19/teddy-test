import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

export default function Register() {
    const navigation = useNavigation();
    
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Rol"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Gender Identity"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Sexual Orientation"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Photo"
        placeholderTextColor="gray"
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("universos")}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "80%",
    color: "black",
  },
  button: {
    backgroundColor: "green",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
