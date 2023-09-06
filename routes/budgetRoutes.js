// Express
const express = require("express");
const router = express.Router();

// Controllers
const budgetController = require("../controllers/budgetController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor } = require("../middleware");

// Routes
// -- RENDER LISTEN PAGE
router.get("/", isLoggedIn, catchAsync(budgetController.renderBudgetPage));


module.exports = router;