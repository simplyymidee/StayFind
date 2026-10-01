import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUetOzUYv_s3aG7KAxWDWKdDr7waAkuiw",
    authDomain: "stayfind-2fab1.firebaseapp.com",
    projectId: "stayfind-2fab1",
    storageBucket: "stayfind-2fab1.firebasestorage.app",
    messagingSenderId: "23053580918",
    appId: "1:23053580918:web:db868e438f2f5e1d64fd57"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth , db };