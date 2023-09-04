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

// -- RENDER NEW NOTE page to create a new note
router.get("/neue-Notiz", isLoggedIn, notizenController.renderNewNote);

// -- CREATE A NEW NOTE
router.post("/neue-Notiz", isLoggedIn, validateNote, catchAsync(notizenController.createNote));

// -- RENDER NOTE SHOW PAGE
router.get("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.showNote));

// RENDER NOTE EDIT PAGE
router.get("/:noteId/bearbeiten", isLoggedIn, isAuthor("note"), catchAsync(notizenController.renderEditNote));

// EDIT A NOTE
router.put("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.editNote));

// DELETE A NOTE
router.delete("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.deleteNote));

module.exports = router;