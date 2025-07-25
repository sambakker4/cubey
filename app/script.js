import { updateTimer } from "./timer.js";
import { generateScramble } from "./scramble.js"
import { createTable, updateTable, resetTable } from "./timeTable.js"
import { hideSignOutButton, loginUser, showSignOutButton, revokeRefreshToken, refreshUser } from "./login.js";
import { createCookie, getRefreshToken, removeCookie } from "./cookies.js";
import { calculateAverageOfFive } from "./average.js";
import { createTime, getTimes } from "./times.js"

const timeTable = document.getElementById("time-table");
let rows = [];
const tableHeadings = ["Num", "Time"];
let timerId;
let isRunning = false;
let startedHolding = 0;
let justStopped = false;
let beingHeld = false;
const timeToHold = 1000;
const url = "http://localhost:8080";
let token = await signInUserWithCookie();

(async function initApp() {
    await addRows();
    createTable(timeTable, tableHeadings, rows);
    document.getElementById("scramble").textContent = generateScramble(20, "3x3");
    document.getElementById("ao5").textContent = calculateAverageOfFive(rows);
})();

async function addRows() {
    let times;
    rows = [];
    if (token != undefined) {
        times = await getTimes(url + `/api/times?amount=8`, token);
        times = times.time_obj;
    } else {
        times = [];
    }

    for (let i = 0; i < times.length; i++) {
        let row = [times[i].number, times[i].time];
        rows.push(row);
    }

    while (rows.length < 8) {
        rows.push(["-", "-"]);
    }
}

setInterval(async function() {
    let refreshToken = getRefreshToken();
    if (refreshToken == "") {
        return;
    }

    let refreshResponse = await refreshUser(refreshToken, url + "/api/refresh");
    if (refreshResponse.length == 1) {
        return;
    }

    token = refreshToken.token;
}, 1000 * 60 * 14);

function updateTimes(time) {
    let value = parseInt(rows[0][0]);
    if (rows[0][0] == "-") {
        value = 0;
    }

    let newTime = [value + 1, time];
    rows.pop();
    rows.unshift(newTime);
}

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
    let time = document.getElementById("time").textContent;
    if (token != undefined) {
        let scramble = document.getElementById("scramble").textContent;
        createTime(url + "/api/times", time, scramble, token);
    }
    updateTimes(time);
    updateTable(timeTable, rows);
    document.getElementById("ao5").textContent = calculateAverageOfFive(rows);
}

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

document.getElementById("signout-button-yes").addEventListener("click", async () => {
    hideSignOutButton();
    token = undefined;
    revokeRefreshToken(getRefreshToken(), url + "/api/revoke");
    removeCookie("refresh_token");
    await addRows();
    resetTable(timeTable);
    document.getElementById("ao5").textContent = calculateAverageOfFive(rows);
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
    resetTable(timeTable, rows);
    await addRows();
    updateTable(timeTable, rows);
    document.getElementById("ao5").textContent = calculateAverageOfFive(rows);
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
    resetTable(timeTable, rows);
    await addRows();
    updateTable(timeTable, rows);
    document.getElementById("ao5").textContent = calculateAverageOfFive(rows);
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
