import { updateTimer } from "./timer.js";
import { generateScramble } from "./scramble.js"
import { createTable } from "./timeTable.js"
import { showLoginPage } from "./login.js";

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
const url = "localhost:8080";

function loginPage() {
    let loginPage = document.getElementById("login-page");
    if (loginPage.style.display == "none") {
        loginPage.style.display = flex;
    }
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
document.getElementById("scramble").textContent = generateScramble(20, "3x3");


document.getElementById("login-button").addEventListener("click", showLoginPage);
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
