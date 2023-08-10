module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Bitte einloggen um alle Funktionen zu nutzen");
    return res.redirect("/login");
  }
  next();
};