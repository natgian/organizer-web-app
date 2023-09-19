let nav = 0; // this variable is used to keep track of the month the user is on
let clicked = null; // which day the user has clicked on
let events // array of event objects

const calendar = document.getElementById("calendar");
const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

// LOAD CALENDAR FUNCTION
function loadCalendar() {
 const date = new Date();

 if (nav !== 0) {
  date.setMonth(new Date().getMonth() + nav);
 }

 const day = date.getDate();
 const month = date.getMonth(); // careful, getMonth index is 0-11 (0 = January, 11 = December)
 const year = date.getFullYear();
 const firstDayOfMonth = new Date(year, month, 1);
 const daysInMonth = new Date(year, month + 1, 0).getDate(); // current year, month, 0 = the last day of the previous month)

 const dateString = firstDayOfMonth.toLocaleDateString("de-de", {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
 });

 const blankDays = weekdays.indexOf(dateString.split(", ")[0]); // calculating the "blank" days before the first day of the month in the week

 document.getElementById("monthDisplay").innerText = `${date.toLocaleDateString("de-de", {month: "long"})} ${year}`;

 calendar.innerHTML = ""; // resetting the calendar

 for(let i = 1; i <= blankDays + daysInMonth; i++) {
  const daySquare = document.createElement("div");
  daySquare.classList.add("daySquare");

  if(i > blankDays) {
    daySquare.innerText = i - blankDays;
    daySquare.addEventListener("click", () => console.log("click"));

    if(i - blankDays === day && nav == 0) {
      daySquare.id = "currentDay";
    }
  } else {
    daySquare.classList.add("blankSquare");
  }

  calendar.appendChild(daySquare);
 }
};

// CHANGE MONTH FUNCTION
function changeMonth() {
  document.getElementById("forwardMonthButton").addEventListener("click", () => {
    nav++;
    loadCalendar();
  });
  document.getElementById("backwardMonthButton").addEventListener("click", () => {
    nav--;
    loadCalendar();
  });
}

changeMonth();
loadCalendar();

