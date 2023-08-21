// Express
const express = require("express");
const router = express.Router();

// Controllers
const listenController = require("../controllers/listenController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateList, validateItem } = require("../middleware");

// Routes
// -- RENDER LISTEN PAGE
router.get("/", isLoggedIn, catchAsync(listenController.renderListenPage));

// -- RENDER NEUE LISTE page to create a new list
router.get("/neue-Liste", isLoggedIn, listenController.renderNewList);

// -- CREATE A NEW LIST
router.post("/", isLoggedIn, validateList, catchAsync(listenController.createList));

// -- RENDER SHOW PAGE
router.get("/:listId", isLoggedIn, catchAsync(listenController.showList));

// -- RENDER EDIT PAGE
router.get("/:listId/bearbeiten", isLoggedIn, isAuthor, catchAsync(listenController.renderEditList));

// -- DELETE ITEM FROM A LIST
router.delete("/:listId/items/:itemId", isLoggedIn, isAuthor, catchAsync(listenController.deleteItemFromList));

// -- EDIT A LIST
router.put("/:listId", isLoggedIn, isAuthor, validateList, catchAsync(listenController.editList));

// -- DELETE A LIST
router.delete("/:listId", isLoggedIn, isAuthor, catchAsync(listenController.deleteList));

// -- ADD NEW ITEM TO A LIST
router.post("/:listId", isLoggedIn, validateItem, catchAsync(listenController.addNewListItem));





module.exports = router;