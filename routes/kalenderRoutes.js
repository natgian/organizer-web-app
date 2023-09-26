// Express
const express = require("express");
const router = express.Router();

// Controllers
const kalenderController = require("../controllers/kalenderController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateCalendar } = require("../middleware");

// Routes

 // -- RENDER KALENDER PAGE
router.get("/", isLoggedIn, catchAsync(kalenderController.renderCalendarPage));

// --  API ROUTE TO FETCH EVENTS
router.get("/api/events", isLoggedIn, catchAsync(kalenderController.loadEvents));

 // -- RENDER NEW CALENDAR EVENT PAGE to create a new event
router.get("/neuer-Eintrag", isLoggedIn, kalenderController.renderNewEvent);

 // -- CREATE A NEW CALENDAR EVENT
router.post("/", isLoggedIn, validateCalendar, catchAsync(kalenderController.createEvent));

 // DELETE AN EVENT
router.delete("/delete-event/:eventId", isLoggedIn, catchAsync(kalenderController.deleteEvent));

 // SEARCH EVENT
router.post("/suchen", isLoggedIn, catchAsync(kalenderController.searchEventSubmit));


module.exports = router;