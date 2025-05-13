import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// TODO: Replace with your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBlkPIWufFbPu83R7XiXiBX3Enna6JcOCo",
  authDomain: "authforvideo.firebaseapp.com",
  projectId: "authforvideo",
  storageBucket: "authforvideo.firebasestorage.app",
  messagingSenderId: "43372471011",
  appId: "1:43372471011:web:d2a58fc8eb5a4acf24dbd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 

