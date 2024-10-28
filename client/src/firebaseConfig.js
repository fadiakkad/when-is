import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxy3ozCWDd8Fj9pdU8XWRXL1SmXfYT8vE",
  authDomain: "maw3eed.firebaseapp.com",
  projectId: "maw3eed",
  storageBucket: "maw3eed.appspot.com",
  messagingSenderId: "768985418800",
  appId: "1:768985418800:web:b123c99a3bb6b2835cb1f5"};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
