import { updateTimer } from "./timer.js";

const timeTable = document.getElementById("time-table");
let rows = [["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"]];
const tableHeadings = ["Num", "Time"];
let timerId;
let isRunning = false;
let currentTime = "00:00";
let startedHolding = 0;
let justStopped = false;
let beingHeld = false;
const timeToHold = 1000;

function createTable(timeTable, headings, rows) {
    let tblHead = document.createElement("thead");
    timeTable.appendChild(tblHead);
    let tblBody = document.createElement("tbody");
    timeTable.appendChild(tblBody);
    
    for (let heading of headings) {
        let th = document.createElement("th");
        tblHead.appendChild(th);
        th.innerText = heading;
        th.setAttribute("scope", "col");
    }
    
    for (let row of rows) {
        let tblRow = document.createElement("tr");
        tblBody.appendChild(tblRow);

        for (let item of row) {
            let data = document.createElement("td");
            tblRow.appendChild(data);
            data.innerText = item;
        }
    }
}

function startTimer() {
    document.getElementById("time").textContent = "00:00.00";
    let startTime = Date.now()
    timerId = setInterval(() => {
        updateTimer(startTime, "time");
    }, 10);
}

function stopTimer() {
    clearInterval(timerId);
}

createTable(timeTable, tableHeadings, rows);
document.addEventListener("keydown", (event) => {
    if (event.key == " ") {
        if (!isRunning && Date.now() - startedHolding >= timeToHold) {
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
            console.log(Date.now() - startedHolding);
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
