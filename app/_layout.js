import { Stack } from 'expo-router'
// Import your global CSS file
import "../global.css";
import React from 'react'

// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';

// const firebaseConfig = {
//     apiKey: "AIzaSyAKS7iUojviZasiEgd9h-auayc8F6zmky8",
//     authDomain: "teddylove-a57b1.firebaseapp.com",
//     projectId: "teddylove-a57b1",
//     storageBucket: "teddylove-a57b1.firebasestorage.app",
//     // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "1:612151459670:android:164aec44a44a0ecf0260f7",
//   };
  
//   // Initialize Firebase if it's not already initialized
//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   } else {
//     firebase.app(); // Use the default app
//   }

export default function RootLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Welcome', headerShown: false }} />
            <Stack.Screen name="home" options={{title: 'Home', headerShown: false}} />
            <Stack.Screen name="register" options={{title: 'Register', headerShown: false}} />
            <Stack.Screen name="login" options={{title: 'Login', headerShown: false}} />
            <Stack.Screen name="universos" options={{title: 'Universos', headerShown: false}} />
            <Stack.Screen name="desplegable" options={{title: 'Desplegable', headerShown: false}} />
            <Stack.Screen name="addfriend" options={{title: 'Addfriend', headerShown: false}} />
            <Stack.Screen name="publish" options={{title: 'Pubish', headerShown: false}} />
            <Stack.Screen name="vipsubscription" options={{title: 'VipSubcription', headerShown: false}} />
            <Stack.Screen name="commentar" options={{title: 'Commentar', headerShown: false}} />
            <Stack.Screen name="megusta" options={{title: 'MeGusta', headerShown: false}} />
            <Stack.Screen name="bot" options={{title: 'Bot', headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        </Stack>
    )
} 