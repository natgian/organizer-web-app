const { List } = require("./models/list");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Bitte einloggen");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { listId } = req.params;
  const foundList = await List.findById(listId);

  if (!foundList || !foundList.user.equals(req.user._id)) {
    return res.status(403).render("pages/403");
  }  
  next();
};


