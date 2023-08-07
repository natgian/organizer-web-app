// Express
const express = require("express");
const router = express.Router();

// Controllers
const notizenController = require("../controllers/notizenController");

// Utilities
const catchAsync = require("../utilities/catchAsync");

// Routes
// -- RENDER NOTIZEN PAGE
router.get("/", catchAsync(notizenController.index));

// -- RENDER NEUE NOTIZ page to create a new note
router.get("/neue-Notiz", notizenController.renderNewNote);


module.exports = router;