import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNo-K-WSNogHIU9O6yf3buv1Bcn-G5hLU",
  authDomain: "personal-countdown.firebaseapp.com",
  projectId: "personal-countdown",
  storageBucket: "personal-countdown.appspot.com",
  messagingSenderId: "1083256333530",
  appId: "1:1083256333530:web:c29ea2b8d14d1f6036b1e3",
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
