module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Bitte einloggen");
    return res.redirect("/login");
  }
  next();
};