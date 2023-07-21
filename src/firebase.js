import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyAJTQrqijCi6AcUqFM42sB2O5JJDpR-0_o",
  authDomain: "pizza-chat-bot-c20d8.firebaseapp.com",
  projectId: "pizza-chat-bot-c20d8",
  storageBucket: "pizza-chat-bot-c20d8.appspot.com",
  messagingSenderId: "34626494210",
  appId: "1:34626494210:web:73f1f57e686202cc21ac1b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export default app;


