
import { addDoc, collection, getDocs, setDoc } from "firebase/firestore";
// import firebase, { db } from './firebase';
// import {getToken} from "firebase/messaging";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import Chatbot from "./components/Chatbot";
import Login from "./components/Login";
import Signup from "./components/signup";
import Test from "./components/test";
import ProtectedRoutes from "./components/protectedRoutes";
import { UserAuthContextApi } from "./context/UserAuthContextApi";

// Component

import { Routes, Route } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./components/Admin";

import { useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db, messaging } from "./firebase";



function App() {
  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker
  //       .register('/firebase-messaging-sw.js')
  //       .then((registration) => {
  //         console.log('Service Worker registered: ', registration);
  //         Handlegetusers()
  //         // Call Handlegetusers or other functions that use messaging.getToken()
  //       })
  //       .catch((error) => {
  //         console.error('Service Worker registration failed: ', error);
  //       });
  //   });
  // }
  
  const Handlegetusers = async () => {
    // getToken(messaging, {vapidKey: "AIzaSyAJTQrqijCi6AcUqFM42sB2O5JJDpR-0_o"});
    getToken(messaging, { vapidKey: 'BF7z2IkEXvh2LEObiWxk6L7QQJ17ZHCHZnpRed-YEkjAc0Q1iMlF1JUOTJVEpovchVCCU_5JzRxHTVE0lJ3J6R4' }).then((currentToken) => {
      if (currentToken) {
        console.log("line32::", currentToken) 
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {          
            console.log('Unable to get permission to notify.');
          }
        });      
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
    // const querySnapshot = await getDocs(collection(db, "users"));
    // // console.log(querySnapshot);
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
  };
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BF7z2IkEXvh2LEObiWxk6L7QQJ17ZHCHZnpRed-YEkjAc0Q1iMlF1JUOTJVEpovchVCCU_5JzRxHTVE0lJ3J6R4",
      });
      console.log("Token Gen", token);
      await addDoc(collection(db, 'token'), { token });
      console.log("Token stored successfully.");
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }
  useEffect(() => {
    // Handlegetusers()
    requestPermission()
  }, [])
  
  
return (
    <>
      <Row>
        <Col>
          <UserAuthContextApi>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/test" element={<Test />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoutes>
                    
                    <Chatbot />
                  </ProtectedRoutes>
                }
              />
            </Routes>
          </UserAuthContextApi>
        </Col>
      </Row>
    </>
  );
}


export default App;
