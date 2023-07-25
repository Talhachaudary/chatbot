import React, { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useUserAuth } from "../context/UserAuthContextApi";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, doc, addDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Act like a pizza order taker and just show a sample menu to anyone who response and at the end of the order please repeat order,ask for address,name and dine in or take away and ask for drinks and assign a identifier to the order which will be equal to #100# and always use the same pattern for order conformation the pattern whould be order id: #100#,pizza: ordered pizza,topping:none,drink: ordered drinks and more fields like phone numbers etc like every detail. ",
};
// user functionality start

// user functionality end
export default function Chatbot() {
  // user email id
  let user = useUserAuth();
  let { logout } = useUserAuth();
  // user email id
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialDataFetched, setIsInitialDataFetched] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Pizza Chatbot! Place Your Order!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  //Order History
  const [extractedData, setExtractedData] = useState([]);

  // useEffect(() => {
  //   const orderHistory = async () => {
  //     const docRef = doc(db, "users", user.user.email);
  //     const docSnap = await getDoc(docRef);
  //     const data = docSnap.data();
  //     const DBmessages = data.Messages || [];
  //     console.log(DBmessages);

  //     const regex = /Order ID: #100#[\s\S]*?(?=\n\n|$)/g; // Regular expression pattern with global flag 'g'
  //     const extractedData = DBmessages.reduce((accumulator, obj) => {
  //       const message = obj.message.toString(); // Convert to string
  //       const matches = message.match(regex);
  //       if (matches) {
  //         return [...accumulator, ...matches];
  //       }
  //       return accumulator;
  //     }, []);

  //     console.log(extractedData);
  //     setExtractedData(extractedData); // Update the state with extracted data
  //   };

  //   orderHistory();
  // }, [messages]);

  //Order History
  // initializing with localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", user.user.email);
        console.log("line 77:: ", user, user.user)
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const DBmessages = data.Messages || [];

        if (docSnap.exists()) {
          if (DBmessages.length > 0) {
            console.log("messages exist");
            setMessages(DBmessages);
          } else {
            console.log("messages do not exist");
          }
        }

        // Set the flag to true after initial data fetching is done
        setIsInitialDataFetched(true);
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchData();
  }, []);
  // initializing with localStorage

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function StoreChatinDb() {
    try {
      const docRef = await setDoc(doc(db, "users", user.user.email), {
        Messages: messages,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    // Update the messages in the database only after the initial data is fetched
    if (isInitialDataFetched) {
      StoreChatinDb();
    }
  }, [messages, isInitialDataFetched]);

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log("line 178::::-----------------------------------",data, data.choices[0],);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  };

  const contentStyle = {
    textAlign: "center",
  };

  const innerContainerStyle = {
    position: "relative",
    height: "70vh",
    width: "700px",
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const docRef = doc(db, "users", user.user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const retrievedMessages = data.Messages || [];
          // console.log("stat var", messages);
          // console.log("local var", retrievedMessages);

          setMessages(retrievedMessages);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching document: ", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.user.email]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left column */}
      <div
        style={{
          flex: "0 0 300px",
          background: "#f0f0f0",
          textAlign: "center",
        }}
      >
        {/* Place your content for the left column here */}
        <h1>Order History</h1>
        <div>
          {extractedData.length > 0 ? (
            <ul>
              {extractedData.map((data, index) => (
                <li key={index}>{data}</li>
              ))}
            </ul>
          ) : (
            <h1>No extracted data found</h1>
          )}
        </div>
      </div>

      {/* Right column */}
      <div style={{ flex: "1", padding: "20px" }}>
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center vh-100">
            <Spinner animation="border" role="status"></Spinner>
            <h1 className="">Loading chat...</h1>
          </div>
        ) : (
          <div style={containerStyle} className="my-5">
            <div>
              <h4 className="pt-2">
                Hello, {user && user.user.email}
                <br /> Welcome <br />
              </h4>
              <div className="py-2">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
              <div style={innerContainerStyle}>
                <MainContainer>
                  <ChatContainer>
                    <MessageList
                      scrollBehavior="smooth"
                      typingIndicator={
                        isTyping ? (
                          <TypingIndicator content="Bot is typing" />
                        ) : null
                      }
                    >
                      {messages &&
                        messages.map((message, i) => {
                          return <Message key={i} model={message} />;
                        })}
                    </MessageList>
                    <MessageInput
                      placeholder="Type message here"
                      onSend={handleSend}
                    />
                  </ChatContainer>
                </MainContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
