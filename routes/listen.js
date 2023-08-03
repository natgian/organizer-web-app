// Express
const express = require("express");
const router = express.Router();

// Controllers
const listen = require("../controllers/listen");

// Utilities
const catchAsync = require("../utilities/catchAsync");

// Routes

// -- Route LISTEN Page
router.get("/", catchAsync(listen.index));

// -- Render NEUE LISTE page to create a new list
router.get("/neue-Liste", listen.renderNewList);

// -- Create a new list
router.post("/", catchAsync(listen.createList));

// -- Render SHOW page
router.get("/:id", catchAsync(listen.showList));

// -- Render EDIT page
router.get("/:id/bearbeiten", catchAsync(listen.renderEditList));

// -- Edit a list
router.put("/:id", catchAsync(listen.editList));

// -- Delete a list
router.delete("/:id", catchAsync(listen.deleteList));


module.exports = router;