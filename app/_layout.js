import { Stack } from 'expo-router'
// Import your global CSS file
import "../global.css";
import React from 'react'

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
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        </Stack>
    )
} 