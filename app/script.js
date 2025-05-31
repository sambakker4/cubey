import { updateTimer } from "./timer.js";
import { generateScramble } from "./scramble.js"
import { createTable } from "./timeTable.js"
import { hideSignOutButton, loginUser, showSignOutButton, revokeRefreshToken, refreshUser } from "./login.js";
import { createCookie, getRefreshToken, removeCookie } from "./cookies.js";

const timeTable = document.getElementById("time-table");
let rows = [["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"]];
const tableHeadings = ["Num", "Time"];
let timerId;
let isRunning = false;
let startedHolding = 0;
let justStopped = false;
let beingHeld = false;
const timeToHold = 1000;
const url = "http://localhost:8080";
let token = await signInUserWithCookie();

async function signInUserWithCookie() {
    let refreshToken = getRefreshToken();
    if (refreshToken == "") {
        return;
    }

    let refreshResponse = await refreshUser(refreshToken, url + "/api/refresh");
    if (refreshResponse.length == 1) {
        return;
    }

    showSignOutButton();
    return refreshResponse.token;
}

function startTimer() {
    document.getElementById("time").textContent = "0.00";
    let startTime = Date.now()
    timerId = setInterval(() => {
        updateTimer(startTime, "time");
    }, 10);
}

function stopTimer() {
    clearInterval(timerId);
    document.getElementById("scramble").textContent = generateScramble(20, "3x3");
}


createTable(timeTable, tableHeadings, rows);
signInUserWithCookie();
document.getElementById("scramble").textContent = generateScramble(20, "3x3");


document.getElementById("login-button").addEventListener("click", () => {
    document.getElementById("login-page").style.display = "flex";
    document.getElementById("signup-page").style.display = "none";
});

document.getElementById("close-login-page-button").addEventListener("click", () => {
    document.getElementById("login-page").style.display = "none";
});

document.getElementById("signup-button").addEventListener("click", () => {
    document.getElementById("signup-page").style.display = "flex";
    document.getElementById("login-page").style.display = "none";
})

document.getElementById("close-signup-page-button").addEventListener("click", () => {
    document.getElementById("signup-page").style.display = "none";
});

document.getElementById("signout-button").addEventListener("click", () => {
    document.getElementById("signout-page").style.display = "flex";
})

document.getElementById("close-signout-page-button").addEventListener("click", () => {
    document.getElementById("signout-page").style.display = "none";
})

document.getElementById("signout-button-no").addEventListener("click", () => {
    document.getElementById("signout-page").style.display = "none";
})

document.getElementById("signout-button-yes").addEventListener("click", () => {
    hideSignOutButton();
    token = undefined;
    revokeRefreshToken(getRefreshToken(), url + "/api/revoke");
    removeCookie("refresh_token");
})

document.getElementById("login-page-form").addEventListener("submit", async function(event){
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    let displayError = document.getElementById("display-error-login");

    displayError.style.display = "none";
    displayError.textContent = "";

    if (!email || !password) {
        displayError.textContent = "Fill out all fields"; 
        displayError.style.display = "block";
    } 

    let response = await loginUser(email, password, url + "/api/login");
    if (response.error != undefined) {
        displayError.textContent = response.error;
        displayError.style.display = "block";
        return;
    }
    showSignOutButton();
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    createCookie("refresh_token", response.refreshToken, 60);
    token = response.token;
});

document.getElementById("signup-page-form").addEventListener("submit", async function(event){
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    let displayError = document.getElementById("display-error-signup");

    displayError.style.display = "none";
    displayError.textContent = "";

    if (!email || !password) {
        displayError.textContent = "Fill out all fields"; 
        displayError.style.display = "block";
        return
    } 

    // signup user

    let response = await loginUser(email, password, url + "/api/users");
    if (response.error != undefined) {
        displayError.textContent = response.error;
        displayError.style.display = "block";
        return;
    }
    // login user

    response = await loginUser(email, password, url + "/api/login");
    if (response.error != undefined) {
        displayError.textContent = response.error;
        displayError.style.display = "block";
        return;
    } 
    showSignOutButton();
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
    createCookie("refresh_token", response.refreshToken, 60);
    token = response.token;
});

document.addEventListener("keydown", (event) => {
    if (event.key == " ") {
        if (beingHeld && Date.now() - startedHolding >= timeToHold) {
            document.getElementById("time").style.color = "green";
        }
        if (isRunning) {
            isRunning = false;
            justStopped = true;
            stopTimer();
        } else if (!beingHeld){
            startedHolding = Date.now();
            document.getElementById("time").style.color = "red";
            beingHeld = true;
        } 
    }
})

document.addEventListener("keyup", (event) => {
    if (event.key == " ") {
        beingHeld = false;
        if (!justStopped) {
            if (Date.now() - startedHolding >= timeToHold) {
                isRunning = true;
                startTimer();
            }
            document.getElementById("time").style.color = "#e76f51";
        } else {
            justStopped = false;
        }
    }
})
