// Express
const express = require("express");
const router = express.Router();

// Controllers
const listenController = require("../controllers/listenController");

// Utilities
const catchAsync = require("../utilities/catchAsync");

// Routes
// -- RENDER LISTEN PAGE
router.get("/", catchAsync(listenController.index));

// -- RENDER NEUE LISTE page to create a new list
router.get("/neue-Liste", listenController.renderNewList);

// -- CREATE A NEW LIST
router.post("/", catchAsync(listenController.createList));

// -- RENDER SHOW PAGE
router.get("/:id", catchAsync(listenController.showList));

// -- RENDER EDIT PAGE
router.get("/:id/bearbeiten", catchAsync(listenController.renderEditList));

// -- EDIT A LIST
router.put("/:id", catchAsync(listenController.editList));

// -- DELETE A LIST
router.delete("/:id", catchAsync(listenController.deleteList));

// -- ADD NEW ITEM TO A LIST
router.post("/:id", catchAsync(listenController.addNewListItem));

// -- DELETE ITEM FROM A LIST
router.delete("/:listId/items/:itemId", catchAsync(listenController.deleteItemFromList));




module.exports = router;