const User = require("../models/user");
const List = require("../models/list");
const { userEmailSchema } = require("../validationSchemas");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
      if (err) return next(err);
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
module.exports.loginUser = (req, res, next) => {
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

// -- RENDER USER PROFILE PAGE
module.exports.renderUserAccount = async (req, res, next) => {
  const { userId } = req.params;
  const loggedInUser = req.user._id;

  if (userId !== loggedInUser.toString()) {
    // User is not authorized to view this profile
    return res.status(403).render("pages/403"); //
  };

  const foundUser = await User.findById(userId);
  if (!foundUser) {
    return res.status(404).render("pages/404");
  };
  res.render("users/profile", { foundUser });
};

// -- RENDER EDIT USER PROFILE
module.exports.renderEditUser = async (req, res, next) => {
  const { userId } = req.params;
  const foundUser = await User.findById(userId);
  res.render("users/edit", { foundUser });
};

// EDIT USER PROFILE
module.exports.editUser = async (req, res, next) => {
  const { userId } = req.params;
  const loggedInUser = req.user._id;

  if (userId !== loggedInUser.toString()) {
    // User is not authorized to view this profile
    return res.status(403).render("pages/403"); //
  };

  const foundUser = await User.findByIdAndUpdate(userId, req.body, { runValidators: true });
  res.redirect(`/benutzerkonto/${foundUser._id}`);
};

// -- RENDER FORGOT PASSWORD PAGE
module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgotPassword");
};

module.exports.renderSentMailConfirmation = (req, res) => {
  res.render("users/sentMailConfirmation");
};

// -- SEND RESET PASSWORD EMAIL TO USER
module.exports.sendResetPasswordEmail = async (req, res, next) => {
    
  const { error } = userEmailSchema.validate(req.body); // Validate the email input
    if (error) {
      req.flash("error", "Bitte gibt eine gültige E-Mail Adresse ein.");
      return res.redirect("/passwort-vergessen");
      // return res.render("pages/error", { err: error.details[0].message });
    };
    
  const user = await User.findOne({ email: req.body.email }); // Find the user by email
    if(!user) {
      req.flash("error", "Kein Benutzer mit dieser E-Mail gefunden.");
      return res.redirect("/passwort-vergessen");
    }

  const resetToken = crypto.randomBytes(32).toString("hex"); // Generate a reset token
  user.resetPasswordToken = resetToken; // Set the reset token in the user's document
  user.resetPasswordExpires = Date.now() + 3600000; // Set the expiration date in the user's document
  await user.save();

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "441ffc0c9ef5d4",
      pass: "c84d9289446308"
    }
  });

  const mailOptions = {
    from: "TaskManagerApp",
    to: user.email,
    subject: "TaskManagerApp Passwort zurücksetzen",
    text: `Du erhältst diese Nachricht, weil du (oder eine andere Person) das Zurücksetzen des Passworts für dein Konto beantragt hast.\n\n` +
    `Bitte klicke auf dien folgenden Link oder füge diesen in deinen Browser ein, um den Vorgang abzuschliessen:\n\n` +
    `http://${req.headers.host}/reset/${resetToken}\n\n` +
    `Wenn du dies nicht angefordert hast, ignoriere bitte diese E-Mail und dein Passwort bleibt unverändert.\n`
  };

  await transporter.sendMail(mailOptions);

  res.redirect("/email-versendet");
  
};



