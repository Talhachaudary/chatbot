// // Import the Firebase SDK
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// // Your Firebase configuration (same as in app.js)
// const firebaseConfig = {
//     apiKey: "AIzaSyAJTQrqijCi6AcUqFM42sB2O5JJDpR-0_o",
//     authDomain: "pizza-chat-bot-c20d8.firebaseapp.com",
//     projectId: "pizza-chat-bot-c20d8",
//     storageBucket: "pizza-chat-bot-c20d8.appspot.com",
//     messagingSenderId: "34626494210",
//     appId: "1:34626494210:web:73f1f57e686202cc21ac1b",
// };

// // Initialize Firebase in the service worker
// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyAJTQrqijCi6AcUqFM42sB2O5JJDpR-0_o",
    authDomain: "pizza-chat-bot-c20d8.firebaseapp.com",
    projectId: "pizza-chat-bot-c20d8",
    storageBucket: "pizza-chat-bot-c20d8.appspot.com",
    messagingSenderId: "34626494210",
    appId: "1:34626494210:web:73f1f57e686202cc21ac1b",
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// messaging.onMessage((payload)=>{
//     console.log("line 50", payload)
// })
