importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBY0LgTmPMJT4_vzzAGlLr5flO6EbIbxi8",
  authDomain: "vtelyu.firebaseapp.com",
  projectId: "vtelyu",
  storageBucket: "vtelyu.firebasestorage.app",
  messagingSenderId: "1082769007683",
  appId: "1:1082769007683:web:1e333ad6551b90594c20f6"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received", payload);
});