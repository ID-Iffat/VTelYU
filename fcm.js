import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {getMessaging, getToken, deleteToken, onMessage} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBY0LgTmPMJT4_vzzAGlLr5flO6EbIbxi8",
  authDomain: "vtelyu.firebaseapp.com",
  projectId: "vtelyu",
  storageBucket: "vtelyu.firebasestorage.app",
  messagingSenderId: "1082769007683",
  appId: "1:1082769007683:web:1e333ad6551b90594c20f6"
};

const app = initializeApp(firebaseConfig);
// Commented part = code attempt used for mobile app
// let messaging = null;
// if ('Notification' in window) {
//     messaging = getMessaging(app);
// } else {
//     console.log("Android WebView detected. Skipping Firebase Web SDK initialization.");
// }
const messaging = getMessaging(app);

window.enableFCM = async function () {
  // if (!('Notification' in window)) {
  //   console.log("Running in Android WebView. Skipping Web Push.");
  //   alert("Notifications are automatically handled by the Android App!");
  //   return; // Stop running here so it never hits the crash below!
  // }
  console.log("Button clicked, requesting permission...");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {alert("Notification permission gagal");
    return;
  }
  console.log("Browser returned:", permission);
  if ('serviceWorker' in navigator) {
    try {await navigator.serviceWorker.register('./firebase-messaging-sw.js');
    } catch (err) {console.error("Service Worker registration failed:", err);
      return;
    }
  }
  const registration = await navigator.serviceWorker.ready;
  try {const token = await getToken(messaging, {
      vapidKey: "BF3mYLlYII1BVOs2VkVk-ac5VH3e6zAMaqxDiv6xPwtQteUE1LMfDGDC01K9kwEQHEBzUzei94g5T2LFlkCW7mc",
      serviceWorkerRegistration: registration
    });
    if (!token) {alert("Failed to get FCM token");
      return;
    }
    localStorage.setItem("fcmToken", token);
    localStorage.setItem("notificationsEnabled", "true");
    await fetch("https://rvm.iffatadibamusaffa.workers.dev/register-token", {method: "POST", body: token});
    console.log("FCM TOKEN:", token);
    console.log("Token Sent to Cloudflare");
    return token;
  } catch (error) {
    console.error("Error generating or sending token:", error);
    alert("An error occurred while enabling notifications. Check console.");
  }
};

window.disableFCM = async function () {
  const token = localStorage.getItem("fcmToken");
  if (!token) {localStorage.setItem("notificationsEnabled", "false");
    return;
  }
  try {await fetch("https://rvm.iffatadibamusaffa.workers.dev/unregister-token", {
      method: "POST",
      body: token
    });
    if ('serviceWorker' in navigator) {const registration = await navigator.serviceWorker.getRegistration('./');
      if (registration) {const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {await existingSub.unsubscribe();
          console.log("Browser push subscription safely removed.");
        }
      }
    }
    try {await deleteToken(messaging);
    } catch (fbError) {
      console.log("Note: Firebase background token deletion skipped (expected on subfolder hosting).");
    }

    localStorage.removeItem("fcmToken");
    localStorage.setItem("notificationsEnabled", "false");
    console.log("Notifications successfully disabled!");
  } catch (error) {
    console.error("Error disabling FCM:", error);
    localStorage.setItem("notificationsEnabled", "false");
  }
};

onMessage(messaging, (payload) => {
  console.log("Foreground Message:", payload);
});