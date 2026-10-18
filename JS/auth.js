import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                updateProfile(user, {
                    displayName: name
                }).then(() => {
                    alert("Account created successfully!");
                    window.location.href = "dashboard.html";
                });
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

//login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Login successful!");
                window.location.href = "dashboard.html";
            })
            .catch((error) => {
                alert("Invalid email or password");
            });
    });
}


//dashboard

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

if (userName) {
    onAuthStateChanged(auth, function(user) {
        if (user) {
            userName.textContent = user.displayName || "User";
        } else {
            window.location.href = "login.html";
        }
    });
}

if (logoutBtn){
    logoutBtn.addEventListener("click", function(){
        signOut(auth).then(() =>{
            window.location.href = "login.html";
        });
    });
}




//EYE FUNCTIONALITY
const loginEye = document.getElementById("loginEye");
const loginPassword = document.getElementById("loginPassword");

const confirmEye = document.getElementById("confirmEye");
const confirmPassword = document.getElementById("confirmPassword");

if (loginEye && loginPassword) {
    loginEye.addEventListener("click", function () {

        if (loginPassword.type === "password") {
            loginPassword.type = "text";
            loginEye.classList.remove("fa-eye-slash");
            loginEye.classList.add("fa-eye");
        } else {
            loginPassword.type = "password";
            loginEye.classList.remove("fa-eye");
            loginEye.classList.add("fa-eye-slash");
        }

    });
}

if (confirmEye && confirmPassword) {
    confirmEye.addEventListener("click", function () {

        if (confirmPassword.type === "password") {
            confirmPassword.type = "text";
            confirmEye.classList.remove("fa-eye-slash");
            confirmEye.classList.add("fa-eye");
        } else {
            confirmPassword.type = "password";
            confirmEye.classList.remove("fa-eye");
            confirmEye.classList.add("fa-eye-slash");
        }

    });
}
