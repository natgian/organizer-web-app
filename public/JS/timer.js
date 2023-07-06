const fullCirclePath = 283;
const WARNING_THRESHOLD = 55;
const ALERT_THRESHOLD = 50;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const timerDurationSpan = document.getElementById("timer-duration");
const breakDurationSpan = document.getElementById("break-duration");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

let timePassed = 0;
let timeLeft = 0;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let timeLimit = 0;

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

function startTimer() {
  timeLimit = parseInt(timerDurationSpan.textContent, 10) * 60;
  disableInputFields();

  const timerDuration = parseInt(timerDurationSpan.textContent, 10);
  const timerTime = timerDuration * 60;

  timePassed = 0;
  timeLeft = timerTime;
  remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);

  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = timerTime - timePassed;

    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);

  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
}

let isTimerPaused = false;

function pauseTimer() {
  if (isTimerPaused) {
    // Resume the timer
    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = timeLimit - timePassed;

      document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
        onTimesUp();
      }
    }, 1000);

    pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z" />
  </svg>`;
    isTimerPaused = false;
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z"/></svg>`;
    isTimerPaused = true;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  enableInputFields();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  timeLeft = parseInt(timerDurationSpan.textContent, 10) * 60;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
  pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z" />
              </svg>`;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining").classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(info.color);
    document.getElementById("base-timer-path-remaining").classList.add(warning.color);
  } else {
    document.getElementById("base-timer-path-remaining").classList.remove(alert.color);
    document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining").classList.add(info.color);
  }
}

function setCircleDasharray() {
  const circleDasharray = `${(calculateTimeFraction() * fullCirclePath).toFixed(0)} 283`;
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / (parseInt(timerDurationSpan.textContent, 10) * 60);
  return rawTimeFraction - (1 / (parseInt(timerDurationSpan.textContent, 10) * 60)) * (1 - rawTimeFraction);
}

function disableInputFields() {
  timerDurationSpan.disabled = true;
  breakDurationSpan.disabled = true;
}

function enableInputFields() {
  timerDurationSpan.disabled = false;
  breakDurationSpan.disabled = false;
}

function onTimesUp() {
  clearInterval(timerInterval);
  enableInputFields();
  startButton.disabled = true;
  pauseButton.disabled = true;
  resetButton.disabled = false;
  playSound();
  startBreak();
}

function playSound() {
  const audio = new Audio("/audio/bell.mp3");
  audio.play();
}

function startBreak() {
  disableInputFields();

  const breakDuration = parseInt(breakDurationSpan.textContent, 10);
  const breakTime = breakDuration * 60;

  timePassed = 0;
  timeLeft = breakTime;
  remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);

  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = breakTime - timePassed;

    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onBreakTimesUp();
    }
  }, 1000);
}

function onBreakTimesUp() {
  clearInterval(timerInterval);
  enableInputFields();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = false;
  playSound();
  // Additional logic for transitioning back to the main timer or other actions
}
