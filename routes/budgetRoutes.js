// Express
const express = require("express");
const router = express.Router();

// Controllers
const budgetController = require("../controllers/budgetController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateBudget, validateTransaction } = require("../middleware");

// Routes
// -- RENDER BUDGET INDEX PAGE
router.get("/", isLoggedIn, catchAsync(budgetController.renderBudgetPage));

// -- RENDER NEUES BUDGET page to create a new budget
router.get("/neues-budget", isLoggedIn, budgetController.renderNewBudget);

// -- CREATE A NEW BUDGET
router.post("/", isLoggedIn, validateBudget, catchAsync(budgetController.createBudget));

// -- RENDER BUDGET SHOW PAGE
router.get("/:budgetId", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.showBudget));

// -- DELETE EXPENSE FROM A BUDGET
router.delete("/:budgetId/transactions/:transactionId", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.deleteTransaction));

// -- RENDER BUDGET EDIT PAGE
router.get("/:budgetId/bearbeiten", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.renderEditBudget));

// -- EDIT A BUDGET
router.put("/:budgetId", isLoggedIn, isAuthor("budget"), validateBudget, catchAsync(budgetController.editBudget));

// -- DELETE A BUDGET
router.delete("/:budgetId", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.deleteBudget));

// -- ADD NEW TRANSACTION TO A BUDGET
router.post("/:budgetId/transaction", isLoggedIn, validateTransaction, catchAsync(budgetController.addTransaction));


module.exports = router;