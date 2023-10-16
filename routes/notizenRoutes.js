// Express
const express = require("express");
const router = express.Router();

// Controllers
const notizenController = require("../controllers/notizenController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateNote } = require("../middleware");

// Routes

// -- RENDER NOTIZEN PAGE
router.get("/", isLoggedIn, catchAsync(notizenController.index));

// // -- RENDER NEW NOTE page to create a new note
router.get("/neue-notiz", isLoggedIn, notizenController.renderNewNote);

// // -- CREATE A NEW NOTE
router.post("/neue-notiz", isLoggedIn, validateNote, catchAsync(notizenController.createNote));

// // SEARCH IN NOTES
router.post("/suchen", isLoggedIn, catchAsync(notizenController.searchNotesSubmit));

// // -- RENDER NOTE SHOW PAGE
router.get("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.showNote));

// // DELETE A NOTE
router.delete("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.deleteNote));

// // EDIT A NOTE
router.put("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.editNote));


module.exports = router;