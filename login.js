import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getAuth,signInWithRedirect, getRedirectResult, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";

const provider = new GoogleAuthProvider();

  const firebaseConfig = {
    apiKey: "AIzaSyBD2RMFWIIYlOtkh7gSAw57x8iyEmDPV4k",
    authDomain: "chat-framework-114c9.firebaseapp.com",
    projectId: "chat-framework-114c9",
    storageBucket: "chat-framework-114c9.appspot.com",
    messagingSenderId: "461584806305",
    appId: "1:461584806305:web:767954adfbdfef9f879be0"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);
  
  document.getElementById("googleSignInButton").addEventListener('click',function(){
  
  signInWithRedirect(auth, provider);
  })
  getRedirectResult(auth)
  .then((result) => {

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    console.log(JSON.parse(JSON.stringify(user)))
        let docRef = doc(db,"user",user.uid)
        getDoc(docRef).then((doc) => {
    let docData = doc.data()
    if(docData == undefined){
      setDoc(docRef,{
        email:user.email, 
        photoURL:user.photoURL, 
        displayName:user.displayName,
        uid:user.uid,
        groups: new Array()
      }).then((dc) => {
        window.location.href = "index.html";
      })
    }else{
      console.log(docData)
      window.location.href = "index.html";
    }
})
  }).catch((error) => {
    console.log(error)
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
