import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD1fVKMQDypIwq6PmoUgAVifuzua1F5N8",
  authDomain: "mobi-c064c.firebaseapp.com",
  projectId: "mobi-c064c",
  storageBucket: "mobi-c064c.firebasestorage.app",
  messagingSenderId: "964234380308",
  appId: "1:964234380308:web:84e56e1f6ae92917dfd301",
  // measurementId is optional and web-only; omitted for React Native
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
