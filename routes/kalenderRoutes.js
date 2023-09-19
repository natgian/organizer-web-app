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

 // TODO:-- RENDER NEW CALENDR EVENT PAGE to create a new event
// router.get("/neue-Notiz", isLoggedIn, notizenController.renderNewNote);

 // TODO:-- CREATE A NEW CALENDAR EVENT
// router.post("/neue-Notiz", isLoggedIn, validateNote, catchAsync(notizenController.createNote));

 // TODO: SEARCH EVENT
// router.post("/suchen", isLoggedIn, catchAsync(notizenController.searchNotesSubmit));

 // TODO: -- RENDER CALENDAR EVENT
// router.get("/:noteId", catchAsync(notizenController.showNote));

 // TODO: DELETE AN EVENT
// router.delete("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.deleteNote));

 // TODO: EDIT AN EVENT
// router.put("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.editNote));


module.exports = router;