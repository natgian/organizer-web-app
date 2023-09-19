// Express
const express = require("express");
const router = express.Router();

// Controllers
const kalenderController = require("../controllers/kalenderController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor } = require("../middleware");

// Routes

 // TODO: -- RENDER KALENDER PAGE
// router.get("/", isLoggedIn, catchAsync(notizenController.index));

 // -- RENDER NEW CALENDAR EVENT PAGE to create a new event
router.get("/neuer-Eintrag", isLoggedIn, kalenderController.renderNewEvent);

 // TODO:-- CREATE A NEW CALENDAR EVENT
router.post("/", isLoggedIn, catchAsync(kalenderController.createEvent));

 // TODO: SEARCH EVENT
// router.post("/suchen", isLoggedIn, catchAsync(notizenController.searchNotesSubmit));

 // TODO: -- RENDER CALENDAR EVENT
// router.get("/:noteId", catchAsync(notizenController.showNote));

 // TODO: DELETE AN EVENT
// router.delete("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.deleteNote));

 // TODO: EDIT AN EVENT
// router.put("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.editNote));


module.exports = router;