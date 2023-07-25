
import { collection, getDocs } from "firebase/firestore";
// import firebase, { db } from './firebase';
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
import { doc, getDoc } from 'firebase/firestore';
import { db } from "./firebase";


function App() {
  // useEffect(()=>{
  //  data() 
  // },[])
  const Handlegetusers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    // console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };
  // const data=async()=>{
  //   const user = { user: { email: "admin@gmial.com" } };
  //   const docRef = doc(db, "users", user.user.email);
  //     const docSnap = await getDoc(docRef);
  //     console .log("line33",docSnap);
  // }
  // useEffect(() => {
  //   // Initialize Firebase
  

  //   // Get a reference to the Firestore collection
  //   const collectionRef = db.collection('users').doc('users');

  //   // Set up a listener for data-change events
  //   const unsubscribe = collectionRef.onSnapshot((snapshot) => {
  //     const data = snapshot.data();
  //     console.log("line36",data)
  //     let user
  //     // Now you have access to the data. For example:
  //     Object.keys(data).forEach((userId) => {
  //        user = data[userId];
  //       // console.log('User ID:', userId);
  //       // console.log('Age:', user.age);
  //       // console.log('First Name:', user.first_name);
  //       // You can access other properties like gender, home_adress, and last_name here
  //     });
  //     console.log("line45",user)
  //   });

  //   // Clean up the listener when the component is unmounted
  //   return () => unsubscribe();
  // }, []);
  
  
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
