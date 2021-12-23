// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8vzrIKxnCrLqh0ev2Kcy8gy0NhmfS1-4",
  authDomain: "webstream-217cd.firebaseapp.com",
  projectId: "webstream-217cd",
  storageBucket: "webstream-217cd.appspot.com",
  messagingSenderId: "398908851162",
  appId: "1:398908851162:web:eab828c5ad36e27424f6e3",
  measurementId: "G-MLQ8MB9LNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);