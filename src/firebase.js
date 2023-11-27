import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdXuupQC8z7pcrcd05xkJu3QMFzh85QH4",
  authDomain: "cangdanang2023.firebaseapp.com",
  projectId: "cangdanang2023",
  storageBucket: "cangdanang2023.appspot.com",
  messagingSenderId: "629348128351",
  appId: "1:629348128351:web:3f9be4ba2b8dbd9c0e6dea",
  measurementId: "G-94CQWQ8WKS",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
export { db, auth, storage };
