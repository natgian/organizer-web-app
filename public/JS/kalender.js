let nav = 0; // this variable is used to keep track of the month the user is on
let blankDays;
let selectedDate;

const calendar = document.getElementById("calendar");
const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const addButton = document.getElementById("add-button");


// FUNCTION --> TO LOAD CALENDAR //
async function loadCalendar() {
  const date = new Date();

  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  };

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

  blankDays = weekdays.indexOf(dateString.split(", ")[0]); // calculating the "blank" days before the first day of the month in the week

  document.getElementById("monthDisplay").innerText = `${date.toLocaleDateString("de-de", { month: "long" })} ${year}`;

  calendar.innerHTML = ""; // resetting the calendar

  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = ""; // clear events when changing the month

  // Fetch event data from the backend
  const eventsData = await fetchEventData();

  // Loop through each day square and check if it has events
  for (let i = 1; i <= blankDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("daySquare");

    if (i > blankDays) {
      daySquare.innerText = i - blankDays;

      if (i - blankDays === day && nav == 0) {
        daySquare.id = "currentDay";
      }
      const currentDate = new Date(year, month, i - blankDays);

      // Check if there are events on this date
      const eventsOnDate = filterEventsByDate(eventsData, currentDate);

      // Render events (e.g., by adding dots or labels)
      if (eventsOnDate.length > 0) {
        const eventIndicator = document.createElement("div");
        eventIndicator.classList.add("event-indicator");
        daySquare.appendChild(eventIndicator);
      }

      // Add a click event listener to handle interactions with the day square
      daySquare.addEventListener("click", () => {
        displayDayEvents(currentDate, eventsOnDate);

        const eventsContainer = document.getElementById("events-container");
        eventsContainer.scrollIntoView({ behavior: "smooth" });

        selectedDate = currentDate;

        // Format the date as yyyy-mm-dd with leading zeros
        const formattedDate = `${currentDate.getFullYear()}-${padZero(currentDate.getMonth() + 1)}-${padZero(currentDate.getDate())}`;
        
        // Store the formatted date in localStorage
        localStorage.setItem("selectedDate", formattedDate);
      });
      
      // Function to pad a number with a leading zero if it's less than 10
      function padZero(number) {
        return number < 10 ? `0${number}` : number;
      };

      addButton.addEventListener("click", () => {
        if (selectedDate) {
          window.location.href = "kalender/neuer-Eintrag";
        } else {
          localStorage.setItem("selectedDate", "");
          window.location.href = "kalender/neuer-Eintrag";
        }
      });
    }

    calendar.appendChild(daySquare);
  }
};

// FUNCTION --> TO FILTER EVENTS BY DATE
function filterEventsByDate(events, targetDate) {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === targetDate.getDate() &&
      eventDate.getMonth() === targetDate.getMonth() &&
      eventDate.getFullYear() === targetDate.getFullYear()
    );
  });
}

// FUNCTION --> TO DISPLAY DAY EVENTS
function displayDayEvents(currentDate, eventsData) {
  // Filter events that match the clicked date
  const eventsOnDate = filterEventsByDate(eventsData, currentDate);
  const eventsContainer = document.getElementById("events-container");
  const eventList = document.createElement("ul");
  // Loop through eventsOnDate and create list items for each event
  eventsOnDate.forEach((event) => {
    const eventListItem = document.createElement("li");
    eventListItem.textContent = `${event.startEventTime} - ${event.endEventTime} ${event.title}`;
    eventListItem.style.backgroundColor = event.color;
    eventListItem.classList.add("event-list-item");
    eventList.appendChild(eventListItem);
  });
  // Append the eventList to the eventsContainer
  eventsContainer.innerHTML = ''; // Clear any previous content
  eventsContainer.appendChild(eventList);
};

// FUNCTION --> TO FETCH EVENT DATA FROM BACKEND
async function fetchEventData() {
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
}

// FUNCTION --> TO CHANGE MONTH
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
