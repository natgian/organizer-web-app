const { List } = require("./models/list");
const Note = require("./models/note");
const { Budget}  = require("./models/budget");
const {listSchema, itemSchema, userSchema, noteSchema, budgetSchema, expenseSchema} = require("./validationSchemas");

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// IS LOGGED IN
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Bitte einloggen");
    return res.redirect("/login");
  }
  next();
};

// IS AUTHOR
module.exports.isAuthor = (resourceType) => {
  return async (req, res, next) => {
    const resourceId = req.params[`${resourceType}Id`];
    
    let foundResource;
    switch (resourceType) {
      case "list":
        foundResource = await List.findById(resourceId);
        break;
      case "note":
        foundResource = await Note.findById(resourceId);
        break;
      case "budget":
        foundResource = await Budget.findById(resourceId);
        break;
      case "project":
        foundResource = await Project.findById(resourceId);
        break;
      default:
        break;
    }

    if (!foundResource || !foundResource.user.equals(req.user._id)) {
      return res.status(403).render("pages/403");
    }
     next();
  };
};

// VALIDATE USER
module.exports.validateUser = async(req, res, next) => {
  const {error} = userSchema.validate(req.body);
  if(error) {
   const msg = error.details.map(element => element.message).join(",");
   req.flash("error", msg);
   return res.redirect("/registration");
  }
  next();
 };

// VALIDATE LIST
module.exports.validateList = async(req, res, next) => {
 const {error} = listSchema.validate(req.body);
 if(error) {
  const msg = error.details.map(element => element.message).join(",");
  req.flash("error", msg);
  return res.redirect("/listen/neue-Liste");
 }
 next();
};

// VALIDATE ITEM
module.exports.validateItem = async(req, res, next) => {
  const listId = req.params.listId;
  const {error} = itemSchema.validate(req.body);
  if(error) {
   const msg = error.details.map(element => element.message).join(",");
   req.flash("error", msg);
   return res.redirect(`/listen/${listId}`);
  }
  next();
 };

 // VALIDATE NOTE
 module.exports.validateNote = async(req, res, next) => {
  const {error} = noteSchema.validate(req.body);
 if(error) {
  const msg = error.details.map(element => element.message).join(",");
  req.flash("error", msg);
  return res.redirect("/notizen/neue-Notiz");
 }
 next();
 };

 // VALIDATE BUDGET
 module.exports.validateBudget = async(req, res, next) => {
  const {error} = budgetSchema.validate(req.body);
  if(error) {
   const msg = error.details.map(element => element.message).join(",");
   req.flash("error", msg);
   return res.redirect("/budget/neues-Budget");
  }
  next();
 };
 
 module.exports.validateExpense = async(req, res, next) => {
   const budgetId = req.params.budgetId;
   const {error} = expenseSchema.validate(req.body);
   if(error) {
    const msg = error.details.map(element => element.message).join(",");
    req.flash("error", msg);
    return res.redirect(`/budget/${budgetId}`);
   }
   next();
  };



