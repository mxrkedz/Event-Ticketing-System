import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mern-tickets.firebaseapp.com",
  projectId: "mern-tickets",
  storageBucket: "mern-tickets.appspot.com",
  messagingSenderId: "912185901496",
  appId: "1:912185901496:web:afc362eda0bd7c92154f4d",
};

const app = initializeApp(firebaseConfig);

export default app;
