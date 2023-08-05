// Express
const express = require("express");
const router = express.Router();

// Controllers
const listen = require("../controllers/listen");

// Utilities
const catchAsync = require("../utilities/catchAsync");

// Routes

// -- ROUTE LISTEN PAGE
router.get("/", catchAsync(listen.index));

// -- RENDER NEUE LISTE page to create a new list
router.get("/neue-Liste", listen.renderNewList);

// -- CREATE A NEW LIST
router.post("/", catchAsync(listen.createList));

// -- RENDER SHOW PAGE
router.get("/:id", catchAsync(listen.showList));

// -- RENDER EDIT PAGE
router.get("/:id/bearbeiten", catchAsync(listen.renderEditList));

// -- EDIT A LIST
router.put("/:id", catchAsync(listen.editList));

// -- DELETE A LIST
router.delete("/:id", catchAsync(listen.deleteList));

// -- ADD NEW ITEM TO A LIST
router.post("/:id", catchAsync(listen.addNewListItem));

// -- DELETE ITEM FROM A LIST



module.exports = router;