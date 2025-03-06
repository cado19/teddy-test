import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase project configuration.*/

const firebaseConfig = {
  apiKey: "AIzaSyAKS7iUojviZasiEgd9h-auayc8F6zmky8",
  authDomain: "teddylove-a57b1.firebaseapp.com",
  projectId: "teddylove-a57b1",
  storageBucket: "teddylove-a57b1.appspot.com", // Make sure this is correct.
  appId: "1:612151459670:android:164aec44a44a0ecf0260f7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export configured Firebase services for use in your app
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;


