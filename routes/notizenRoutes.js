// Express
const express = require("express");
const router = express.Router();

// Controllers
const notizenController = require("../controllers/notizenController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor } = require("../middleware");

// Routes
// -- RENDER NOTIZEN PAGE
router.get("/", isLoggedIn, catchAsync(notizenController.index));

// -- RENDER NEW NOTE page to create a new note
router.get("/neue-Notiz", isLoggedIn, notizenController.renderNewNote);

// -- CREATE A NEW NOTE
router.post("/neue-Notiz", isLoggedIn, catchAsync(notizenController.createNote));

// -- RENDER NOTE SHOW PAGE
router.get("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.showNote));

// TODO: RENDER NOTE EDIT PAGE
router.get("/:noteId/bearbeiten", isLoggedIn, isAuthor("note"), catchAsync(notizenController.editNote));

// TODO: EDIT A NOTE
router.put("/:noteId", isLoggedIn, isAuthor("note"), catchAsync(notizenController.editNote));

// TODO: DELETE A NOTE


module.exports = router;