import React, { useEffect, useState } from "react";
import "../components/admin.css"
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContextApi";
import { collection, doc, addDoc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { db, messaging } from "../firebase";
import { Alert } from "react-bootstrap";

const AdminPanel = () => {
  // Sample pizza types (You can customize this with actual pizza types)
  const [alertShows, setAlertShows] = useState(false);
  const pizzaTypes = ["Margherita", "Pepperoni", "Vegetarian", "Supreme"];
// State to store selected pizza type and message
  const [selectedPizza, setSelectedPizza] = useState("");
  const [message, setMessage] = useState("");
  let user = useUserAuth();
  let email = []
  let tokens = [];
  let tokenPromises
  const Handlegetusers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      // console.log("line 22", doc.id)
      email.push(...email, doc.id)
    });
    // console.log("line 25::", email)
    const tokenCollection = collection(db, 'token');

    // Get all documents from the "token" collection
    const tokenSnapshot = await getDocs(tokenCollection);

    // Extract the FCM tokens from the documents
    tokenPromises = tokenSnapshot.docs.map((doc) => doc.data().token);

    tokenSnapshot.forEach((doc) => {
      tokens.push(doc.data().token);
    });
    console.log("line 39::: ", tokenPromises)
  };
  const fetchData = async () => {
    if (user) {
      const docRef = doc(db, "users");
      console.log("line 18", user);
      // Perform further operations with the 'user' data here
    }
  };
  

  // Function to handle message submission
  const sendMessage = () => {
    console.log("line 52:: ", tokens)
    if (selectedPizza && message) {
      // Here, you can implement the logic to send the message to users who ordered the selected pizza
      console.log("Sending message:", message, "to users who ordered:", selectedPizza);
      // setAlertShows(true)
      FcmAPI(selectedPizza, message)
      // Clear the fields after sending the message
      setSelectedPizza("");
      setMessage("");
    }
  };
  /// send message function
  const serverKey= "AAAACA_mXwI:APA91bHAz4TvhCTFsjSHiYh2ERTdgg2lCvVBH4jPwR7lzjrmx9I9jZa2ZuVw5tWe_SDMTKp030GIRbk6LEEqhQtY6rH-87FilapBlXfG6T3SIunPWUK5wE8Czhc_HIMIcBj4YEspgIJc"
  
  const FcmAPI = async (title, body) => {
    console.log("line 65:: ", title, body, tokens)
    await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: "key=" + serverKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          notification: {
            title: title,
            body: body,
          },
          registration_ids: tokenPromises,
        }
      ),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Notification sent successfully:', data);
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      console.error('Error sending notification:', tokens);
    });
  }
  const navigate = useNavigate();
  let { logout } = useUserAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
useEffect(()=>{
  // fetchData()
  Handlegetusers()
},[])

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {alertShows && (<Alert variant={"success"}>
          This is a alert—check it out!
        </Alert>)}
      <label>
        Select Pizza Type:
        <select
          value={selectedPizza}
          onChange={(e) => setSelectedPizza(e.target.value)}
        >
          <option value="">Select a pizza type</option>
          {pizzaTypes.map((pizzaType) => (
            <option key={pizzaType} value={pizzaType}>
              {pizzaType}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          cols="50"
        />
      </label>
      <br />
      <button onClick={sendMessage}>Send Message</button>
      <div className="py-2">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
    </div>
  );
};

export default AdminPanel;