import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjUAi8utCfIVXykVRN5qZ1ArvwvN2ZRgU",
  authDomain: "lms-project-90cdd.firebaseapp.com",
  projectId: "lms-project-90cdd",
  appId: "1:249187940167:web:705f1cfde2c587d8327e62"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =========================
// GLOBAL STATE
// =========================
let player = null;
let ytReady = false;
let userReady = false;
let trackingStarted = false;

// =========================
// AUTH
// =========================
onAuthStateChanged(auth, (user) => {

    if (!user) {
        setTimeout(() => {
            if (!auth.currentUser) {
                window.location.href = "login.html";
            }
        }, 800);
        return;
    }

    userReady = true;

    document.getElementById("welcomeText").innerText =
        "Welcome " + user.email.split("@")[0];

    loadDashboardProgress();
    loadDynamicSections();

    initPlayer();
});

// =========================
// LOGOUT
// =========================
window.logout = () => signOut(auth);

// =========================
// DARK MODE
// =========================
window.toggleTheme = () => {
    document.body.classList.toggle("dark");
};

// =========================
// YOUTUBE API READY
// =========================
window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    initPlayer();
};

// =========================
// INIT PLAYER
// =========================
function initPlayer() {

    const container = document.getElementById("player1");

    if (!ytReady || !userReady || !container || player) return;

    player = new YT.Player('player1', {
        height: '220',
        width: '100%',
        videoId: 'rwF-X5STYks',
        events: {
            onReady: onPlayerReady
        }
    });
}

// =========================
// ON READY → RESUME
// =========================
function onPlayerReady() {

    const saved = localStorage.getItem("yt-time");

    if (saved) {
        player.seekTo(parseFloat(saved));
    }

    startTracking();
}

// =========================
// TRACK PROGRESS
// =========================
function startTracking() {

    if (trackingStarted) return;
    trackingStarted = true;

    setInterval(() => {

        if (!player) return;

        const state = player.getPlayerState();
        if (state !== YT.PlayerState.PLAYING) return;

        const current = player.getCurrentTime();
        const duration = player.getDuration();

        if (!duration) return;

        let percent = (current / duration) * 100;

        if (percent >= 98) percent = 100;

        document.getElementById("bar1").style.width = percent + "%";
        document.getElementById("p1").innerText = Math.floor(percent) + "%";

        localStorage.setItem("yt-time", current);

    }, 1000);
}

// =========================
// DIP VIDEO (RESUME + TRACK)
// =========================
window.addEventListener("DOMContentLoaded", () => {

    const v = document.getElementById("video2");
    const bar = document.getElementById("bar2");
    const text = document.getElementById("p2");

    if (!v) return;

    const saved = localStorage.getItem("dip-time");
    if (saved) v.currentTime = parseFloat(saved);

    v.addEventListener("timeupdate", () => {

        if (!v.duration) return;

        let percent = (v.currentTime / v.duration) * 100;

        if (percent >= 98) percent = 100;

        bar.style.width = percent + "%";
        text.innerText = Math.floor(percent) + "%";

        localStorage.setItem("dip-time", v.currentTime);
    });
});

// =========================
// DASHBOARD PROGRESS
// =========================
function loadDashboardProgress() {
    const progress = JSON.parse(localStorage.getItem("progress")) || {};

    const ai = progress["Artificial Intelligence"] || 0;
    const dip = progress["Digital Image Processing"] || 0;

    document.getElementById("aiProgressText").innerText = "Progress: " + ai + "%";
    document.getElementById("aiProgressBar").style.width = ai + "%";

    document.getElementById("dipProgressText").innerText = "Progress: " + dip + "%";
    document.getElementById("dipProgressBar").style.width = dip + "%";
}

// =========================
// DYNAMIC SECTIONS
// =========================
function loadDynamicSections() {
    const progress = JSON.parse(localStorage.getItem("progress")) || {};

    const pendingList = document.getElementById("pendingList");
    const activityList = document.getElementById("activityList");

    pendingList.innerHTML = "";
    activityList.innerHTML = "";

    const courses = [
        { name: "Artificial Intelligence", short: "AI" },
        { name: "Digital Image Processing", short: "DIP" }
    ];

    courses.forEach(course => {
        const prog = progress[course.name] || 0;

        if (prog < 100) {
            const li = document.createElement("li");
            li.innerText = `${course.short} Assignment - ${prog}%`;
            pendingList.appendChild(li);
        }

        const li = document.createElement("li");

        if (prog === 0) li.innerText = `📖 Started ${course.short}`;
        else if (prog < 100) li.innerText = `▶ Learning ${course.short} (${prog}%)`;
        else li.innerText = `✔ Completed ${course.short}`;

        activityList.appendChild(li);
    });
}

