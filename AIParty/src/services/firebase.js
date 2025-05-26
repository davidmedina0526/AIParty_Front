import { initializeApp } from 'firebase/app';
import 'react-native-url-polyfill/auto';
import {
  getDatabase,
  ref as dbRef,
  set,
  onValue,
  push,
  update,
  get,
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
  getDownloadURL
} from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBx7U08N4D5FIMxjCvtRCWk2utoXQJ1REY",
  authDomain: "final-movil-2025-1.firebaseapp.com",
  databaseURL: "https://final-movil-2025-1-default-rtdb.firebaseio.com",
  projectId: "final-movil-2025-1",
  storageBucket: "final-movil-2025-1.firebasestorage.app",
  messagingSenderId: "384718196906",
  appId: "1:384718196906:web:4f657652f7d83d511f40d3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Re-exporta lo que vas a usar
export {dbRef, set, onValue, push, update, get, storageRef, uploadBytes, uploadString, getDownloadURL};