// Express
const express = require("express");
const router = express.Router();

// Controllers
const budgetController = require("../controllers/budgetController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor } = require("../middleware");

// Routes
// -- RENDER BUDGET INDEX PAGE
router.get("/", isLoggedIn, catchAsync(budgetController.renderBudgetPage));

// -- RENDER NEUES BUDGET page to create a new budget
router.get("/neues-Budget", isLoggedIn, budgetController.renderNewBudget);

// -- CREATE A NEW LIST
router.post("/", isLoggedIn, catchAsync(budgetController.createBudget));

// -- RENDER BUDGET SHOW PAGE
router.get("/:budgetId", isLoggedIn, catchAsync(budgetController.showBudget));

TODO: // -- DELETE EXPENSE FROM A BUDGET
// router.delete("/:listId/items/:itemId", isLoggedIn, isAuthor("list"), catchAsync(listenController.deleteItemFromList));

// -- RENDER EDIT PAGE
router.get("/:budgetId/bearbeiten", isLoggedIn, catchAsync(budgetController.renderEditBudget));

// -- EDIT A LIST
router.put("/:budgetId", isLoggedIn, catchAsync(budgetController.editBudget));

TODO: // -- DELETE A BUDGET
// router.delete("/:listId", isLoggedIn, isAuthor("list"), catchAsync(listenController.deleteList));

// -- ADD NEW EXPENSE TO A BUDGET
router.post("/:budgetId", isLoggedIn, catchAsync(budgetController.addNewExpense));


module.exports = router;