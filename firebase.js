import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBD2RMFWIIYlOtkh7gSAw57x8iyEmDPV4k",
    authDomain: "chat-framework-114c9.firebaseapp.com",
    projectId: "chat-framework-114c9",
    storageBucket: "chat-framework-114c9.appspot.com",
    messagingSenderId: "461584806305",
    appId: "1:461584806305:web:767954adfbdfef9f879be0"
  };

  // Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(uid)
    // ...
  } else {
    // User is signed out
    // ...
  }
});
