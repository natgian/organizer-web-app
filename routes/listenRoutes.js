// Express
const express = require("express");
const router = express.Router();

// Controllers
const listenController = require("../controllers/listenController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn } = require("../middleware");

// Routes
// -- RENDER LISTEN PAGE
router.get("/", isLoggedIn, catchAsync(listenController.index));

// -- RENDER NEUE LISTE page to create a new list
router.get("/neue-Liste", isLoggedIn, listenController.renderNewList);

// -- CREATE A NEW LIST
router.post("/", isLoggedIn, catchAsync(listenController.createList));

// -- RENDER SHOW PAGE
router.get("/:id", isLoggedIn, catchAsync(isLoggedIn, listenController.showList));

// -- RENDER EDIT PAGE
router.get("/:id/bearbeiten", isLoggedIn, catchAsync(listenController.renderEditList));

// -- EDIT A LIST
router.put("/:id", isLoggedIn, catchAsync(listenController.editList));

// -- DELETE A LIST
router.delete("/:id", isLoggedIn, catchAsync(listenController.deleteList));

// -- ADD NEW ITEM TO A LIST
router.post("/:id", isLoggedIn, catchAsync(listenController.addNewListItem));

// -- DELETE ITEM FROM A LIST
router.delete("/:listId/items/:itemId", isLoggedIn, catchAsync(listenController.deleteItemFromList));




module.exports = router;