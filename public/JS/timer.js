const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

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

const timerDurationInput = document.getElementById("timer-duration");
const shortBreakDurationInput = document.getElementById("short-break-duration");
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
  timeLimit = parseInt(timerDurationInput.value, 10) * 60;
  disableInputFields();

  const timerDuration = parseInt(timerDurationInput.value, 10);
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

    pauseButton.innerHTML = "Pause";
    isTimerPaused = false;
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    pauseButton.innerHTML = "Resume";
    isTimerPaused = true;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  enableInputFields();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  timeLeft = parseInt(timerDurationInput.value, 10) * 60;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
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
  const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / (parseInt(timerDurationInput.value, 10) * 60);
  return rawTimeFraction - (1 / (parseInt(timerDurationInput.value, 10) * 60)) * (1 - rawTimeFraction);
}

function disableInputFields() {
  timerDurationInput.disabled = true;
  shortBreakDurationInput.disabled = true;
}

function enableInputFields() {
  timerDurationInput.disabled = false;
  shortBreakDurationInput.disabled = false;
}

function onTimesUp() {
  clearInterval(timerInterval);
  enableInputFields();
  startButton.disabled = true;
  pauseButton.disabled = true;
  resetButton.disabled = false;
  playSound();
  startShortBreak();
}

function playSound() {
  const audio = new Audio("sound/bell.mp3");
  audio.play();
}

function startShortBreak() {
  disableInputFields();

  const shortBreakDuration = parseInt(shortBreakDurationInput.value, 10);
  const shortBreakTime = shortBreakDuration * 60;

  timePassed = 0;
  timeLeft = shortBreakTime;
  remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);

  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = shortBreakTime - timePassed;

    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onShortBreakTimesUp();
    }
  }, 1000);
}

function onShortBreakTimesUp() {
  clearInterval(timerInterval);
  enableInputFields();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = false;
  playSound();
  // Additional logic for transitioning back to the main timer or other actions
}
