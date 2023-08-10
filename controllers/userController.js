const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Render registration page
module.exports.renderRegisterPage = (req, res) => {
  res.render("users/registration");
}

// Register a new user
module.exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email });
    const registeredUser = await User.register(newUser, password);
    req.flash("success", "Erfolgreich registriert!");
    res.redirect("/home");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/registration");
  }
};

// Render login page
module.exports.renderLoginPage = (req, res) => {
  res.render("users/login");
};

// Login a user
module.exports.loginUser = (req, res) => {
    res.redirect("/home");
};



