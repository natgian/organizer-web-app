const User = require("../models/user");
const { userEmailSchema } = require("../validationSchemas");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const verifyTurnstile = require("../utilities/verifyTurnstile");
const siteKey = process.env.CLOUDFLARE_SITE_KEY;

// RENDER REGISTRATION PAGE
module.exports.renderRegisterPage = (req, res) => {
  res.render("users/registration", { site_key: siteKey });
};

// REGISTER A NEW USER
module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, "cf-turnstile-response": token } = req.body;
    const ip = req.headers["cf-connecting-ip"];
    const newUser = new User({ email, username });

    await verifyTurnstile(token, ip);

    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      // req.flash("success", "Erfolgreich registriert!");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.status(400).render("users/registration", {
      site_key: process.env.CLOUDFLARE_SITE_KEY,
      error: e.message,
    });
  }
};

// RENDER LOGIN PAGE
module.exports.renderLoginPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    const loggedInUser = req.user;
    res.render("users/login", { loggedInUser });
  }
};

// LOGIN
module.exports.loginUser = (req, res, next) => {
  const redirectUrl = res.locals.returnTo || "/home";
  res.redirect(redirectUrl);
};

// LOGIN DEMO USER
module.exports.loginDemoUser = async (req, res, next) => {
  try {
    const demoUser = await User.findOne({ isDemo: true });

    if (!demoUser) {
      return res.status(404).send("Demo User nicht gefunden");
    }

    req.login(demoUser, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/home");
    });
  } catch (error) {
    next(error);
  }
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
  }

  const foundUser = await User.findById(userId);
  if (!foundUser) {
    return res.status(404).render("pages/404");
  }
  res.render("users/profile", { foundUser });
};

// -- RENDER EDIT USER PROFILE
module.exports.renderEditUser = async (req, res, next) => {
  const { userId } = req.params;
  const foundUser = await User.findById(userId);
  res.render("users/editUsername", { foundUser });
};

// -- EDIT USER PROFILE
module.exports.editUser = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { userId } = req.params;
  const loggedInUser = req.user._id;

  if (userId !== loggedInUser.toString()) {
    // User is not authorized to view this profile
    return res.status(403).render("pages/403"); //
  }

  const foundUser = await User.findByIdAndUpdate(userId, req.body, {
    runValidators: true,
  });
  res.redirect(`/benutzerkonto/${foundUser._id}`);
};

// -- RENDER EDIT PASSWWORD PAGE
module.exports.renderChangePassword = async (req, res, next) => {
  const { userId } = req.params;
  const foundUser = await User.findById(userId);
  res.render("users/changePassword", { foundUser });
};

// -- EDIT PASSWORD
module.exports.changePassword = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const foundUser = await User.findById(req.params.userId);

  if (!foundUser) {
    req.flash("error", "Benutzer nicht gefunden");
    return res.redirect("/home");
  }

  foundUser.authenticate(req.body.oldPassword, async (err, valid) => {
    if (err || !valid) {
      req.flash("error", "Das alte Passwort ist nicht korrekt.");
      return res.redirect(`/benutzerkonto/${foundUser._id}/passwort`);
    }

    foundUser.setPassword(req.body.newPassword, async () => {
      await foundUser.save();
      req.flash("success", "Passwort wurde erfolgreich geändert.");
      res.redirect(`/benutzerkonto/${foundUser._id}`);
    });
  });
};

// -- RENDER FORGOT PASSWORD PAGE
module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgotPassword", { foundUser: req.user });
};

// -- RENDER SENT MAIL CONFIRMATION PAGE
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
  }

  const user = await User.findOne({ email: req.body.email }); // Find the user by email
  if (!user) {
    req.flash("error", "Kein Benutzer mit dieser E-Mail gefunden.");
    return res.redirect("/passwort-vergessen");
  }

  const resetToken = crypto.randomBytes(32).toString("hex"); // Generate a reset token
  user.resetPasswordToken = resetToken; // Set the reset token in the user's document
  user.resetPasswordExpires = Date.now() + 3600000; // Set the expiration date in the user's document
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "MeinOrganizer - Passwort zurücksetzen",
    text:
      `Du erhältst diese Nachricht, weil das Zurücksetzen des Passworts für dein Konto beantragt wurde.\n\n` +
      `Bitte klicke auf den folgenden Link oder füge diesen in deinen Browser ein, um den Vorgang abzuschliessen:\n\n` +
      `http://${req.headers.host}/reset/${resetToken}\n\n` +
      `Wenn du dies nicht angefordert hast, ignoriere bitte diese E-Mail und dein Passwort bleibt unverändert.\n`,
  };

  await transporter.sendMail(mailOptions);

  res.redirect("/email-versendet");
};

// -- RENDER RESET PASSWORD PAGE
module.exports.renderResetPassword = async (req, res, next) => {
  // check if token is maching the user and is still valid
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    req.flash("error", "Link ist ungültig oder abgelaufen.");
    return res.redirect("/passwort-vergessen");
  }

  res.render("users/resetPassword", { token: req.params.token });
};

// -- RESET THE PASSWORD
module.exports.resetPassword = async (req, res, next) => {
  // check if token is maching the user and is still valid
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    req.flash("error", "Link ist ungültig oder abgelaufen.");
    return res.redirect("/passwort-vergessen");
  }

  // Ensure the new password and the confirmation match
  if (req.body.password !== req.body.confirm) {
    req.flash("error", "Passwörter stimmen nicht überein.");
    return res.redirect(`/reset/${req.params.token}`);
  }
  // Use the setPassword method from passport-local-mongoose to hash new password
  user.setPassword(req.body.password, async (err) => {
    if (err) {
      req.flash("error", "Ein Fehler ist unterlaufen. Bitte versuche es erneut.");
      return res.render("resetPassword", { token: req.params.token });
    }
    // Clear the resetPasswordToken and resetPasswordExpires
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the user
    await user.save();

    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "Ein Fehler ist unterlaufen. Bitte versuche es erneut.");
        return res.redirect(`/reset/${req.params.token}`);
      }

      // Redirect to the user's profile or any desired location
      req.flash("success", "Dein Passwort wurde erfolgreich geändert.");
      return res.redirect("/home");
    });
  });
};
