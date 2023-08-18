const User = require("../models/user");
const List = require("../models/list");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// RENDER REGISTRATION PAGE
module.exports.renderRegisterPage = (req, res) => {
  res.render("users/registration");
}

// REGISTER A NEW USER
module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      // req.flash("success", "Erfolgreich registriert!");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/registration");
  }
};

// RENDER LOGIN PAGE
module.exports.renderLoginPage = (req, res) => {
  res.render("users/login");
};

// LOGIN
module.exports.loginUser = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/home"; 
    res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
      res.redirect("/login");
  });
};


