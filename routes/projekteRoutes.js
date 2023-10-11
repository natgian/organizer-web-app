// Express
const express = require("express");
const router = express.Router();

// Controllers
const projekteController = require("../controllers/projekteController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateProject, isAuthor, validateTodo, validateProjectBudget, validateProjectBudgetExpense } = require("../middleware");

// Routes
// -- RENDER PROJEKTE PAGE
router.get("/", isLoggedIn, catchAsync(projekteController.renderProjektePage));

// -- RENDER NEUES PROJEKT page to create a new project
router.get("/neues-projekt", isLoggedIn, projekteController.renderNewProject);

// -- CREATE A NEW PROJECT
router.post("/", isLoggedIn, validateProject, catchAsync(projekteController.createProject));

// -- RENDER PROJECT SHOW PAGE
router.get("/:projectId", isLoggedIn, isAuthor("project"), catchAsync(projekteController.showProject));

// -- ADD NEW TODO
router.post("/:projectId/aufgaben", isLoggedIn, validateTodo, isAuthor("project"), catchAsync(projekteController.addNewProjectTodo));

// -- HANDLE TODOS COMPLETION STATE
router.put("/:projectId/aufgaben/:todoId", isLoggedIn, catchAsync(projekteController.toggleTodoCompletion));

// -- ADD NEW PROJECT BUDGET
router.post("/:projectId/budget", isLoggedIn, validateProjectBudget, isAuthor("project"), catchAsync(projekteController.addProjectBudget));

// -- ADD NEW BUDGET EXPENSE
router.post("/:projectId/budget/ausgabe", isLoggedIn, validateProjectBudgetExpense, isAuthor("project"), catchAsync(projekteController.addProjectBudgetExpense));

// -- RENDER EDIT PAGE
router.get("/:projectId/bearbeiten", isLoggedIn, isAuthor("project"), catchAsync(projekteController.renderEditProject));

// -- DELETE A PROJECT
router.delete("/:projectId", isLoggedIn, isAuthor("project"), catchAsync(projekteController.deleteProject));

// -- DELETE TODO FROM A TODO-LIST
router.delete("/:projectId/aufgaben/:todoId", isLoggedIn, isAuthor("project"), catchAsync(projekteController.deleteTodoFromTodos));

// -- DELETE ALL TODOS FROM A TODO-LIST
router.delete("/:projectId/aufgaben", isLoggedIn, isAuthor("project"), catchAsync(projekteController.deleteAllTodos));

// DELETE A BUDGET EXPENSE
router.delete("/:projectId/budget/ausgabe/:expenseId", isLoggedIn, isAuthor("project"), catchAsync(projekteController.deleteProjectBudgetExpense));

// DELETE A BUDGET
router.delete("/:projectId/budget", isLoggedIn, isAuthor("project"), catchAsync(projekteController.deleteProjectBudget));

// EDIT A BUDGET
router.post("/:projectId/budget/bearbeiten/:budgetId", isLoggedIn, isAuthor("project"), catchAsync(projekteController.editProjectBudget));

// -- EDIT A PROJECT
router.put("/:projectId", isLoggedIn, isAuthor("project"), catchAsync(projekteController.editProject));


module.exports = router;