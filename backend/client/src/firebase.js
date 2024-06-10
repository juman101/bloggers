// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB9FpYIClAR7mpY6vAcy-v3nTa3P3bKa-w",
  authDomain: "blog-c7cb4.firebaseapp.com",
  databaseURL: "https://blog-c7cb4-default-rtdb.firebaseio.com",
  projectId: "blog-c7cb4",
  storageBucket: "blog-c7cb4.appspot.com",
  messagingSenderId: "756707685355",
  appId: "1:756707685355:web:f724de757666e10c1d5fae",
  measurementId: "G-57CQ9P85ZL"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
