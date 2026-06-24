
// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {

    // SIGNUP
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = signupForm.querySelector('input[type="text"]').value;

            // store user name
            localStorage.setItem("username", name);

            // redirect
            window.location.href = "dashboard.html";
        });
    }

    // LOGIN
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = loginForm.querySelector('input[type="text"]').value;

            // store user name
            localStorage.setItem("username", name);

            // redirect
            window.location.href = "dashboard.html";
        });
    }

});