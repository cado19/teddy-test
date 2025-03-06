import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/firestore'
import 'firebase/storage'
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAKS7iUojviZasiEgd9h-auayc8F6zmky8",
    authDomain: "teddylove-a57b1.firebaseapp.com",
    projectId: "teddylove-a57b1",
    storageBucket: "teddylove-a57b1.firebasestorage.app",
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:612151459670:android:164aec44a44a0ecf0260f7",
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
// export const firestore = firebase.firestore();
export const storage = getStorage(app);
// export const database = firebase.database();
export { firebase };


