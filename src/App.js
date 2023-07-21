// Component
import firebase from 'firebase/compat/app';
import "firebase/messaging";
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


function App() {
//   useEffect(() => {
    
//     getMessaging
//       .requestPermission()
//       .then(() => {
//         console.log("Notification permission granted.");
//         // TODO: You can save the token to your database or use it to send notifications
//         return getMessaging.getToken();
//       })
//       .then((token) => {
//         console.log("Token: ", token);
//       })
//       .catch((err) => {
//         console.log("Error occurred while requesting permission: ", err);
//       });
//       getMessaging.onMessage((payload) => {
//         console.log("Received foreground message: ", payload);
//         // You can handle the received message here, for example, show a notification using a library like 'react-toastify'
//       });
//   }, []);
useEffect(() => {
  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
      console.log("Notification permission granted.");
      // TODO: You can save the token to your database or use it to send notifications
      return messaging.getToken();
    })
    .then((token) => {
      console.log("Token: ", token);
    })
    .catch((err) => {
      console.log("Error occurred while requesting permission: ", err);
    });

  messaging.onMessage((payload) => {
    console.log("Received foreground message: ", payload);
    // You can handle the received message here, for example, show a notification using a library like 'react-toastify'
  });
}, []);
  
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
