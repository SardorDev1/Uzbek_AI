import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBosKNLZ50gBAp7S_HL7yXpO-k9eO_I_dM",
    authDomain: "uzbekai.firebaseapp.com",
    projectId: "uzbekai",
    storageBucket: "uzbekai.appspot.com",
    messagingSenderId: "374433858600",
    appId: "1:374433858600:web:fe998f2c70d65eb3e5a11d",
    measurementId: "G-JM91RW9C4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);