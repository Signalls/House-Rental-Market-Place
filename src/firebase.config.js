// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiTKADdXgoWGWn1uluIS4Sll1-olhMvPE",
    authDomain: "house-marketplace-app-1b4b4.firebaseapp.com",
    projectId: "house-marketplace-app-1b4b4",
    storageBucket: "house-marketplace-app-1b4b4.appspot.com",
    messagingSenderId: "148104347313",
    appId: "1:148104347313:web:5609bc4d92260153fbac90"
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
export const db = getFirestore();