function updateTimer(startTime, timerId) {
    let timeElapsed = Date.now() - startTime;
    let second = 1000;
    let minute = second * 60;

    let minutes = Math.floor(timeElapsed / minute);
    let seconds = Math.floor((timeElapsed % minute) / second);
    let milliseconds = Math.floor((timeElapsed % second) / 10);

    if (milliseconds.toString().length < 2) {
        milliseconds = "0" + milliseconds.toString();
    }

    if (minutes == 0) {
        document.getElementById(timerId).textContent =
            `${seconds}.${milliseconds}`;
    } else {
        if (seconds.toString().length < 2) {
            seconds = "0" + seconds.toString();
        }
        document.getElementById(timerId).textContent =
            `${minutes}:${seconds}.${milliseconds}`;
    }
}

export { updateTimer };
