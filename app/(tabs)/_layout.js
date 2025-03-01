import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="profile" screenOptions={{ tabBarStyle: {backgroundColor: 'black'} }}>
      <Tabs.Screen
        name="reels"
        options={{
          title: "Reels",
          tabBarIcon: () => (
            <Image source={require("../../assets/reels.png")} style={styles.images} />
          ),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Posts",
          tabBarIcon: () => (
            <Image source={require("../../assets/posts.jpg")} style={styles.images} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: () => (
            <Image source={require("../../assets/match.jpg")} style={styles.images} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: () => (
            <Image source={require("../../assets/chats.jpg")} style={styles.images} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <Image source={require("../../assets/profile.jpg")} style={styles.images} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    images: {
        height: 40,
        width: 40,
        marginBottom: 10
    }
});