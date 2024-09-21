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
const { isLoggedIn, validateUser } = require("../middleware");
const { storeReturnTo } = require("../middleware");

// Routes
// -- RENDER REGISTRATION PAGE
router.get("/registration", userController.renderRegisterPage);

// -- REGISTER A NEW USER
router.post(
  "/registration",
  validateUser,
  catchAsync(userController.registerUser)
);

// -- RENDER LOGIN PAGE
router.get("/login", userController.renderLoginPage);

// -- LOGIN A USER
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    failureMessage: true,
  }),
  userController.loginUser
);

// -- LOGIN DEMO USER
router.get("/demo-login", userController.loginDemoUser);

// -- LOGOUT A USER
router.get("/logout", userController.logoutUser);

// -- RENDER USER PROFILE PAGE
router.get(
  "/benutzerkonto/:userId",
  isLoggedIn,
  catchAsync(userController.renderUserAccount)
);

// -- RENDER USER EDIT PAGE
router.get(
  "/benutzerkonto/:userId/bearbeiten",
  isLoggedIn,
  catchAsync(userController.renderEditUser)
);

// -- EDIT A USER
router.put(
  "/benutzerkonto/:userId",
  isLoggedIn,
  catchAsync(userController.editUser)
);

// -- RENDER PASSWORD EDIT PAGE
router.get(
  "/benutzerkonto/:userId/passwort",
  isLoggedIn,
  catchAsync(userController.renderChangePassword)
);

// -- EDIT PASSWORD
router.post(
  "/benutzerkonto/:userId/passwort",
  isLoggedIn,
  catchAsync(userController.changePassword)
);

// -- RENDER FORGOT PASSWORD PAGE
router.get("/passwort-vergessen", userController.renderForgotPassword);

// -- SEND RESET PASSWORD EMAIL TO USER
router.post(
  "/passwort-vergessen",
  catchAsync(userController.sendResetPasswordEmail)
);

// -- RENDER SENT MAIL PAGE
router.get("/email-versendet", userController.renderSentMailConfirmation);

// -- RENDER RESET PASSWORD PAGE
router.get("/reset/:token", catchAsync(userController.renderResetPassword));

// -- RESET PASSWORD
router.post("/reset/:token", catchAsync(userController.resetPassword));

module.exports = router;
