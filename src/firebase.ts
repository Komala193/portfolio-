import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACrHlwY6Ghr95JUk1hUc6OmoBU0SIOkgQ",
  authDomain: "portfolio-3623a.firebaseapp.com",
  projectId: "portfolio-3623a",
  storageBucket: "portfolio-3623a.firebasestorage.app",
  messagingSenderId: "239349053621",
  appId: "1:239349053621:web:57c4b22523c08c64b0e6fc",
  measurementId: "G-RG8TP9CJ3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally since isSupported() is needed for certain environments
export let analytics: any = null;

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized successfully.");
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
}).catch((err) => {
  console.warn("Could not check Firebase Analytics support:", err);
});

export { app };
