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

// -- RENDER PROJECT SHOW PAGE
router.get("/:projectId", isLoggedIn, catchAsync(projekteController.showProject));

// -- RENDER PROJECT TODOS SHOW PAGE
router.get("/:projectId/aufgaben", isLoggedIn, catchAsync(projekteController.showProjectToDos));

// -- ADD NEW TODO
router.post("/:projectId/aufgaben", isLoggedIn, catchAsync(projekteController.addNewProjectTodo));

router.put("/:projectId/aufgaben/:todoId", isLoggedIn, catchAsync(projekteController.toggleTodoCompletion));


// -- RENDER EDIT PAGE
// router.get("/:listId/bearbeiten", isLoggedIn, isAuthor("list"), catchAsync(listenController.renderEditList));

// -- DELETE ITEM FROM A LIST
// router.delete("/:listId/items/:itemId", isLoggedIn, isAuthor("list"), catchAsync(listenController.deleteItemFromList));

// -- EDIT A LIST
// router.put("/:listId", isLoggedIn, isAuthor("list"), catchAsync(listenController.editList));

// -- DELETE A LIST
// router.delete("/:listId", isLoggedIn, isAuthor("list"), catchAsync(listenController.deleteList));







module.exports = router;