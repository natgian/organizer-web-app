let nav = 0; // this variable is used to keep track of the month the user is on
let clicked = null; // which day the user has clicked on
let events // array of event objects

const calendar = document.getElementById("calendar");
const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

function loadCalendar() {
 const date = new Date();

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

 for(let i = 1; i <= blankDays + daysInMonth; i++) {
  const daySquare = document.createElement("div");
  daySquare.classList.add("daySquare");

  if(i > blankDays) {
    daySquare.innerText = i - blankDays;
    daySquare.addEventListener("click", () => console.log("click"));
  } else {
    daySquare.classList.add("blankSquare");
  }

  calendar.appendChild(daySquare);
 }
};

loadCalendar();

