// VARIABLES //

// Total length of the timer circle path
const FULL_DASHARRAY = 283;
// Threshold value where progress color transitions from "info" to "warning"
const WARNING_THRESHOLD = 10;
// Threshold value where progress color transitions from "warning" to "alert"
const ALERT_THRESHOLD = 5;

// Object defining the color codes for the timer progress
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

// Variables for START, PAUSE, RESET buttons
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

// Variable for timer state (focus or pause session)
const timerState = document.getElementById("timer-state");

// Event listeners for START, PAUSE, RESET buttons
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

startButton.disabled = false;
pauseButton.disabled = true;
resetButton.disabled = false;

// Variables to keep track of the timer condition
let timePassed = 0;
let timeLeft = 0;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let timeLimit = 0;
let isTimerPaused = false;

// Variables for timer and break duration settings
const timerDurationIndicator = document.getElementById("timer-duration");
const breakDurationIndicator = document.getElementById("break-duration");
const timerMinusButton = document.getElementById("timer-minus");
const timerPlusButton = document.getElementById("timer-plus");
const breakMinusButton = document.getElementById("break-minus");
const breakPlusButton = document.getElementById("break-plus");

// Event listeners timer and pause duration settings
timerMinusButton.addEventListener("click", decreaseTimerDuration);
timerPlusButton.addEventListener("click", increaseTimerDuration);
breakMinusButton.addEventListener("click", decreaseBreakDuration);
breakPlusButton.addEventListener("click", increaseBreakDuration);

//----------
// FUNCTIONS
//----------

// Function to start the timer
function startTimer() {
  timeLimit = parseInt(timerDurationIndicator.textContent, 10) * 60;
  disableSettings();

  const timerDuration = parseInt(timerDurationIndicator.textContent, 10);
  const timerTime = timerDuration * 60;

  timePassed = 0;
  timeLeft = timerTime;
  remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);

  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = timeLimit - timePassed;

    document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
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

// Function to decrease the timer duration
function decreaseTimerDuration() {
  let currentDuration = parseInt(timerDurationIndicator.textContent, 10);
  const step = currentDuration === 5 ? 4 : 5; 

  if (currentDuration > 1) {
    currentDuration -= step;
    if(currentDuration < 1) {
      currentDuration = 1;
    }
    timerDurationIndicator.textContent = currentDuration;

    if (timeLeft !== 0) {
      timePassed = 0;
      timeLeft = currentDuration * 60;
      document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft);
    }
  }
}

// Function to increase the timer duration
function increaseTimerDuration() {
  let currentDuration = parseInt(timerDurationIndicator.textContent, 10);
  const step = currentDuration === 1 ? 4 : 5;
  
  currentDuration += step;
  timerDurationIndicator.textContent = currentDuration;
  
  if (timeLeft !== 0) {
    timePassed = 0;
    timeLeft = currentDuration * 60;
    document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
  }
}

// Function to decrease the break duration
function decreaseBreakDuration() {
  let currentDuration = parseInt(breakDurationIndicator.textContent, 10);
  const step = currentDuration === 5 ? 4 : 5; 

  if (currentDuration > 1) {
    currentDuration -= step;
    breakDurationIndicator.textContent = currentDuration;
  }
}

// Function to increase the break duration
function increaseBreakDuration() {
  let currentDuration = parseInt(breakDurationIndicator.textContent, 10);
  const step = currentDuration === 1 ? 4 : 5;

  currentDuration += step;
  breakDurationIndicator.textContent = currentDuration;
}



function pauseTimer() {
  if (isTimerPaused) {
    // Resume the timer
    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = timeLimit - timePassed;

      document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
        onTimesUp();
      }
    }, 1000);

    pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z"/></svg>`;
    isTimerPaused = false;
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5v14l8-7m2 7h3V5h-3m5 0v14h3V5"/></svg>`;
    isTimerPaused = true;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  enableSettings();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  timeLeft = parseInt(timerDurationIndicator.textContent, 10) * 60;
  document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
  pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z" />
              </svg>`;
  isTimerPaused = false; 
}



function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
  const circleDasharray = `${(calculateTimeFraction() * FULL_DASHARRAY).toFixed(0)} 283`;
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
  return timeLeft / (parseInt(timerDurationIndicator.textContent, 10) * 60);
}

function disableSettings() {
  timerMinusButton.disabled = true;
  timerPlusButton.disabled = true;
  breakMinusButton.disabled = true;
  breakPlusButton.disabled = true;
}

function enableSettings() {
  timerMinusButton.disabled = false;
  timerPlusButton.disabled = false;
  breakMinusButton.disabled = false;
  breakPlusButton.disabled = false;
}

function onTimesUp() {
  clearInterval(timerInterval);
  enableSettings();
  startButton.disabled = true;
  pauseButton.disabled = true;
  resetButton.disabled = false;
  playSound();
  startBreak();
}

function onBreaksUp() {
  clearInterval(timerInterval);
  enableSettings();
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  playSound();

  timePassed = 0;
  timeLeft = parseInt(timerDurationIndicator.textContent, 10) * 60;
  remainingPathColor = COLOR_CODES.info.color;
  document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);

  timerState.innerHTML = "Focus";
  timerState.style.color = "#fff";
}

function playSound() {
  const audio = new Audio("/audio/bell.mp3");
  audio.play();
}

function startBreak() {
  timeLimit = parseInt(breakDurationIndicator.textContent, 10) * 60;
  disableSettings();

  const timerDuration = parseInt(breakDurationIndicator.textContent, 10);
  const timerTime = timerDuration * 60;

  timePassed = 0;
  timeLeft = timerTime;
  remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);

  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = timeLimit - timePassed;

    document.getElementById("base-timer-indicator").textContent = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    timerState.innerHTML = "Pause";
    timerState.style.color = "red";

    if (timeLeft === 0) {
      onBreaksUp();
    }
  }, 1000);

  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
}


