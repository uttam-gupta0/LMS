// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjUAi8utCfIVXykVRN5qZ1ArvwvN2ZRgU",
  authDomain: "lms-project-90cdd.firebaseapp.com",
  projectId: "lms-project-90cdd",
  appId: "1:249187940167:web:705f1cfde2c587d8327e62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =========================
// SIGNUP
// =========================
const signupForm = document.getElementById("signupForm");
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 🔥 Save name PER USER in Firebase
            await updateProfile(userCredential.user, {
                displayName: name
            });

            alert("Signup successful ✅");
            window.location.href = "dashboard.html";
        } catch (err) {
            alert(err.message);
        }
    });
}

// =========================
// LOGIN
// =========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);

            alert("Login successful ✅");
            window.location.href = "dashboard.html";

        } catch (err) {
            alert("Invalid credentials ❌");
        }
    });
}

