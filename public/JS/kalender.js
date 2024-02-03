let nav = 0; // this variable is used to keep track of the month the user is on
let blankDays;
let selectedDate;
let focusedDaySquare = null;

const calendar = document.getElementById("calendar");
const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const addButton = document.getElementById("add-button");

// EVENT LISTENER TO CHECK FOCUSED DAY SQUARE
document.addEventListener("click", (event) => {
  // Check if the click event is not within a daySquare and a daySquare is currently focused
  if (!event.target.classList.contains("daySquare") && focusedDaySquare) {
    // Remove the focus style from the currently focused daySquare
    focusedDaySquare.classList.remove("focused-daySquare");
    focusedDaySquare = null;
  }
});

// LOAD CALENDAR //
async function loadCalendar() {
  const date = new Date();
  date.setMonth(date.getMonth() + nav);

  const { year, month, daysInMonth, blankDays } = getDateDetails(date);

  updateMonthDisplay(date);
  clearCalendarAndEvents();

  const eventsData = await fetchEventData(year, month);

  for (let i = 1; i <= blankDays + daysInMonth; i++) {
    const daySquare = createDaySquare(i, blankDays, eventsData, year, month);
    document.getElementById("calendar").appendChild(daySquare);
  }

  addButton.addEventListener("click", () => {
    if (!selectedDate) {
      localStorage.setItem("selectedDate", "");
    }
    window.location.assign("/kalender/neuer-eintrag");
  });
};

// GET DATE DETAILS (year, month etc..) //
function getDateDetails(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString("de-de", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const blankDays = weekdays.indexOf(dateString.split(", ")[0]);
  return { year, month, daysInMonth, blankDays };
};

// UPDATE THE DISPLAY OF THE MONTH // 
function updateMonthDisplay(date) {
  const year = date.getFullYear();
  document.getElementById("monthDisplay").innerText = `${date.toLocaleDateString("de-de", { month: "long" })} ${year}`;
};

// SET CALENDAR AND EVENTS TO EMPTY STRING // 
function clearCalendarAndEvents() {
  document.getElementById("calendar").innerHTML = "";
  document.getElementById("events-container").innerHTML = "";
};

// CREATE VISUAL DAY SQUARE //
function createDaySquare(day, blankDays, eventsData, year, month) {
  const daySquare = document.createElement("div");
  daySquare.classList.add("daySquare");

  if (day > blankDays) {
    daySquare.innerText = day - blankDays;

    const currentDate = new Date(year, month, day - blankDays);
    const eventsOnDate = filterEventsByDate(eventsData, currentDate);

    if (eventsOnDate.length > 0) {
      const eventIndicator = document.createElement("div");
      eventIndicator.classList.add("event-indicator");
      daySquare.appendChild(eventIndicator);
    }

    daySquare.addEventListener("click", () => {
      handleDaySquareClick(daySquare, currentDate, eventsOnDate);
    });

    daySquare.addEventListener("dblclick", () => {
      selectedDate = currentDate;  
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      localStorage.setItem("selectedDate", formattedDate);
      window.location.assign("/kalender/neuer-eintrag");
    });
  }
  return daySquare;
};

// HANDLE CLICKS ON A DAY SQUARE // 
function handleDaySquareClick(daySquare, currentDate, eventsOnDate) {
  // Remove focus from the previously focused daySquare
  if (focusedDaySquare) {
    focusedDaySquare.classList.remove("focused-daySquare");
  }

  // Add focus to the current daySquare
  focusedDaySquare = daySquare;
  daySquare.classList.add("focused-daySquare");

  // Check if there are events on this date
  // Clear eventsContainer if there are no events on this date
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = eventsOnDate.length > 0 ? "" : "";

  // Display events for the clicked day
  displayDayEvents(currentDate, eventsOnDate);

  // Scroll to eventsContainer
  eventsContainer.scrollIntoView({ behavior: "smooth" });

  // Update selectedDate and save to local storage
  selectedDate = currentDate;
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  localStorage.setItem("selectedDate", formattedDate);
};

// FILTER EVENTS BY DATE //
function filterEventsByDate(events, targetDate) {
  return events.filter((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return startDate <= targetDate && targetDate <= endDate;
  });
};

// DISPLAY DAY EVENTS //
function displayDayEvents(currentDate, eventsData) {
  // Filter events that match the clicked date
  const eventsOnDate = filterEventsByDate(eventsData, currentDate);

  eventsOnDate.sort((eventA, eventB) => {
    const timeA = eventA.startEventTime || "23:59";
    const timeB = eventB.startEventTime || "23:59";

    return timeA.localeCompare(timeB);
  });

  const eventsContainer = document.getElementById("events-container");
  const eventList = document.createElement("ul");
  eventList.classList.add("event-list");

  // Loop through eventsOnDate and create list items for each event
  eventsOnDate.forEach((event) => {
    const eventListItem = document.createElement("li");
    eventListItem.classList.add("event-item");
    eventListItem.style.backgroundColor = event.color;

    const eventTitle = document.createElement("div");
    const eventTime = document.createElement("div");
    eventTitle.classList.add("event-title");
    eventTime.classList.add("event-time");

    eventTitle.textContent = event.title;
    eventTime.textContent = event.startEventTime && event.endEventTime ? `${event.startEventTime} - ${event.endEventTime}` : "";

    const deleteEventButton = document.createElement("button");
    deleteEventButton.classList.add("delete-btn-dark");
    deleteEventButton.setAttribute("title", "Eintrag löschen");
    deleteEventButton.addEventListener("click", () => {
      deleteCalendarEvent(event._id);
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", "M7 21q-.825 0-1.413-.588T5 19V6q-.425 0-.713-.288T4 5q0-.425.288-.713T5 4h4q0-.425.288-.713T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.588 1.413T17 21H7Zm5-7.1l1.9 1.9q.275.275.7.275t.7-.275q.275-.275.275-.7t-.275-.7l-1.9-1.9l1.9-1.9q.275-.275.275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275L12 11.1l-1.9-1.9q-.275-.275-.7-.275t-.7.275q-.275.275-.275.7t.275.7l1.9 1.9l-1.9 1.9q-.275.275-.275.7t.275.7q.275.275.7.275t.7-.275l1.9-1.9Z");

    svg.appendChild(path);
    deleteEventButton.appendChild(svg);

    eventListItem.appendChild(eventTitle);
    eventListItem.appendChild(eventTime);
    eventListItem.appendChild(deleteEventButton);

    eventList.appendChild(eventListItem);
  });
  // Append the eventList to the eventsContainer
  eventsContainer.innerHTML = ""; // Clear any previous content
  eventsContainer.appendChild(eventList);
};

// SEND AJAX REQUEST TO DELETE CALENDAR EVENT //
function deleteCalendarEvent(eventId) {
  if (!eventId) {
    console.log("Event ID fehlt.");
    return;
  }

  fetch(`/kalender/delete-event/${eventId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        loadCalendar();
      } else {
        console.log("Ein Fehler ist aufgetreten, der Löschvorgang konnte nicht abgeschlossen werden.");
      }
    })
    .catch((error) => {
      console.error("Ein Fehler ist aufgetreten.", error);
    });
};

// FETCH EVENT DATA FROM BACKEND //
async function fetchEventData(year, month) {
  try {
    const response = await fetch("/kalender/api/events");
    if (response.ok) {
      const events = await response.json();
      return events;
    } else {
      throw new Error("Failed to fetch event data");
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    return [];
  }
};

// EVENT LISTENERS TO CHANGE THE MONTH
document.getElementById("forwardMonthButton").addEventListener("click", () => {
  nav++;
  loadCalendar();
});

document.getElementById("backwardMonthButton").addEventListener("click", async () => {
  nav--;
  loadCalendar();
});

loadCalendar();
