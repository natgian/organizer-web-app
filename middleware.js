const { List } = require("./models/list");
const {listSchema, itemSchema, userSchema} = require("./validationSchemas");

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

module.exports.validateList = async(req, res, next) => {
 const {error} = listSchema.validate(req.body);
 if(error) {
  const msg = error.details.map(element => element.message).join(",");
  req.flash("error", msg);
  return res.redirect("/listen/neue-Liste");
 }
 next();
};

module.exports.validateItem = async(req, res, next) => {
  const listId = req.params.listId;
  console.log(listId);
  const {error} = itemSchema.validate(req.body);
  console.log(error);
  if(error) {
   const msg = error.details.map(element => element.message).join(",");
   req.flash("error", msg);
   return res.redirect(`/listen/${listId}`);
  }
  next();
 };

 module.exports.validateUser = async(req, res, next) => {
  const {error} = userSchema.validate(req.body);
  if(error) {
   const msg = error.details.map(element => element.message).join(",");
   req.flash("error", msg);
   return res.redirect("/registration");
  }
  next();
 };


