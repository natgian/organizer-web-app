// Express
const express = require("express");
const router = express.Router();

// Controllers
const budgetController = require("../controllers/budgetController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateBudget, validateExpense } = require("../middleware");

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
router.delete("/:budgetId/expenses/:expenseId", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.deleteExpenseFromBudget));

// -- RENDER BUDGET EDIT PAGE
router.get("/:budgetId/bearbeiten", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.renderEditBudget));

// -- EDIT A BUDGET
router.put("/:budgetId", isLoggedIn, isAuthor("budget"), validateBudget, catchAsync(budgetController.editBudget));

// -- DELETE A BUDGET
router.delete("/:budgetId", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.deleteBudget));

// -- ADD NEW EXPENSE TO A BUDGET
router.post("/:budgetId", isLoggedIn, validateExpense, catchAsync(budgetController.addNewExpense));

// -- GET BUDGET PDF
// router.get("/:budgetId/download-pdf", isLoggedIn, isAuthor("budget"), catchAsync(budgetController.createPDF));

module.exports = router;