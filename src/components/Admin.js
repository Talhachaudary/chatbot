import React, { useState } from "react";
import "../components/admin.css"
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContextApi";
const AdminPanel = () => {
  // Sample pizza types (You can customize this with actual pizza types)
  const pizzaTypes = ["Margherita", "Pepperoni", "Vegetarian", "Supreme"];

  // State to store selected pizza type and message
  const [selectedPizza, setSelectedPizza] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle message submission
  const sendMessage = () => {
    if (selectedPizza && message) {
      // Here, you can implement the logic to send the message to users who ordered the selected pizza
      console.log("Sending message:", message, "to users who ordered:", selectedPizza);
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