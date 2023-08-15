// Express
const express = require("express");
const router = express.Router();

// Modals
const User = require("../models/user");

// Passport
const passport = require("passport");

// Controllers
const userController = require("../controllers/userController");

// Utilities
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn } = require("../middleware");
const { storeReturnTo } = require("../middleware");

// Routes
// -- RENDER REGISTRATION PAGE
router.get("/registration", userController.renderRegisterPage);

// -- REGISTER A NEW USER
router.post("/registration", catchAsync(userController.registerUser));

// -- RENDER LOGIN PAGE
router.get("/login", userController.renderLoginPage);

// -- LOGIN A USER
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", failureMessage: true }), userController.loginUser);

// -- LOGOUT A USER
router.get('/logout', userController.logoutUser);


module.exports = router;

