import { updateTimer } from "./timer.js";
import { generateScramble } from "./scramble.js"
import { createTable } from "./timeTable.js"
import { loginUser } from "./login.js";

const timeTable = document.getElementById("time-table");
let rows = [["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"]];
const tableHeadings = ["Num", "Time"];
let timerId;
let isRunning = false;
let startedHolding = 0;
let justStopped = false;
let beingHeld = false;
const timeToHold = 1000;
let token;
const url = "http://localhost:8080";

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


document.getElementById("login-page-form").addEventListener("submit", async function(event){
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    let displayError = document.getElementById("display-error-login");
    if (!email || !password) {
        displayError.textContent = "Fill out all fields"; 
        displayError.style.display = "block";
    } else {
        displayError.style.display = "none";
        displayError.textContent = "";
    }

    let response = await loginUser(email, password, url + "/api/login");
    if (response.length == 1) {
        displayError.textContent = response[0];
        displayError.style.display = "block";
        return;
    } else {
        token = response[0];
    }
});

document.getElementById("signup-page-form").addEventListener("submit", async function(event){
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    let displayError = document.getElementById("display-error-signup");
    if (!email || !password) {
        displayError.textContent = "Fill out all fields"; 
        displayError.style.display = "block";
    } else {
        displayError.style.display = "none";
        displayError.textContent = "";
    }
    // signup user

    let response = await loginUser(email, password, url + "/api/users");
    if (response.length == 1) {
        displayError.textContent = response[0];
        displayError.style.display = "block";
        return;
    }
    // login user

    response = await loginUser(email, password, url + "/api/login");
    if (response.length == 1) {
        displayError.textContent = response[0];
        displayError.style.display = "block";
        return;
    } else {
        token = response[0];
    }
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
