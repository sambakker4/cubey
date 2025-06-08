function calculateAverageOfFive(rows) {
    if (rows[4][1] == "-") {
        return "Ao5: N/A";
    }
    console.log(rows);

    let totalMilliseconds = 0
    for (let i = 0; i < 5; i++) {
        totalMilliseconds += parseTimes(rows[i][1]);
        console.log(totalMilliseconds);
        console.log(i);
    }

    let averageTime = totalMilliseconds / 5;
    console.log(averageTime);
    
    let second = 1000;
    let minute = second * 60;

    let minutes = Math.floor(averageTime / minute);
    let seconds = Math.floor((averageTime % minute) / second);
    let milliseconds = Math.floor((averageTime % second) / 10);

    if (minutes == 0) {
        return "Ao5: " + seconds + "." + milliseconds;
    } 

    if (seconds.toString().length < 2) {
        seconds = "0" + seconds.toString();
    }
    return "Ao5: " + minutes + ":" + seconds + "." + milliseconds;
}

function parseTimes(timeString) {
    let totalMilliseconds = 0;
    let minutesString = timeString.split(":");
    if (minutesString.length != 1) {
        let minutes = minutesString[0];
        minutes = parseInt(minutes);
        totalMilliseconds += minutes * 60 * 1000;
    }

    let secondsString;
    if (minutesString.length == 1) {
        secondsString = minutesString[0].split(".");
    } else {
        secondsString = minutesString[1].split(".");
    }

    let seconds = secondsString[0];
    seconds = parseInt(seconds);
    totalMilliseconds += seconds * 1000;

    let milliseconds = secondsString[1];
    milliseconds = parseInt(milliseconds);

    totalMilliseconds += milliseconds * 10;

    return totalMilliseconds;
}

export { calculateAverageOfFive };
