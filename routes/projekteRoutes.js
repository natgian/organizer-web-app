// Express
const express = require("express");
const router = express.Router();

// Controllers
const projekteController = require("../controllers/projekteController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateProject } = require("../middleware");

// Routes
// -- RENDER PROJEKTE PAGE
router.get("/", isLoggedIn, catchAsync(projekteController.renderProjektePage));

// -- RENDER NEUES PROJEKT page to create a new project
router.get("/neues-projekt", isLoggedIn, projekteController.renderNewProject);

// -- CREATE A NEW PROJECT
router.post("/", isLoggedIn, validateProject, catchAsync(projekteController.createProject));

// -- RENDER SHOW PAGE
// router.get("/:listId", isLoggedIn, catchAsync(listenController.showList));

// -- RENDER EDIT PAGE
// router.get("/:listId/bearbeiten", isLoggedIn, isAuthor("list"), catchAsync(listenController.renderEditList));

// -- DELETE ITEM FROM A LIST
// router.delete("/:listId/items/:itemId", isLoggedIn, isAuthor("list"), catchAsync(listenController.deleteItemFromList));

// -- EDIT A LIST
// router.put("/:listId", isLoggedIn, isAuthor("list"), catchAsync(listenController.editList));

// -- DELETE A LIST
// router.delete("/:listId", isLoggedIn, isAuthor("list"), catchAsync(listenController.deleteList));

// -- ADD NEW ITEM TO A LIST
// router.post("/:listId", isLoggedIn, validateItem, catchAsync(listenController.addNewListItem));





module.exports = router;