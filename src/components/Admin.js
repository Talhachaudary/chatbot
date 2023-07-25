import React, { useEffect, useState } from "react";
import "../components/admin.css"
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContextApi";
import { collection, doc, addDoc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { db, messaging } from "../firebase";
import { Alert } from "react-bootstrap";

const AdminPanel = () => {
  // Sample pizza types (You can customize this with actual pizza types)
  const pizzaTypes = ["Margherita", "Pepperoni", "Vegetarian", "Supreme"];
// State to store selected pizza type and message
  const [selectedPizza, setSelectedPizza] = useState("");
  const [message, setMessage] = useState("");
  let user = useUserAuth();
  let email = []
  const Handlegetusers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    // console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("line 22", doc.id)
      email.push(...email, doc.id)
    });
    console.log("line 25::", email)
  };
  const fetchData = async () => {
    if (user) {
      const docRef = doc(db, "users");
      console.log("line 18", user);
      // Perform further operations with the 'user' data here
    }
  };
  
  // const fetchData = async () => {
  //   const docRef = doc(db, "users", user.user.email);
  //  console.log("line18",user[0]);
  // }

  // Function to handle message submission
  const sendMessage = () => {
    if (selectedPizza && message) {
      // Here, you can implement the logic to send the message to users who ordered the selected pizza
      console.log("Sending message:", message, "to users who ordered:", selectedPizza);
      email.forEach((userEmail) => {
        // Call the function to send emails here
        // alert(userEmail, selectedPizza, message);
        alert(`Sending message: "${message}" to user with email: "${userEmail}"`);
      });
      // Clear the fields after sending the message
      setSelectedPizza("");
      setMessage("");
    }
  };
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