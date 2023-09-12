const User = require("../models/user");
const {Expense, Budget} = require("../models/budget");


// RENDER LISTEN PAGE
module.exports.renderBudgetPage = async (req, res, next) => {
  const budgets = await Budget.find({ user: req.user._id }).populate("user");
  res.render("pages/budget", { budgets });
};

// RENDER NEW BUDGET PAGE
module.exports.renderNewBudget = (req, res) => {
  res.render("budgets/new");
};

// CREATE A NEW BUDGET
module.exports.createBudget = async (req, res) => {
  const newBudget = new Budget(req.body);
  newBudget.user = req.user._id;
  await newBudget.save();
  req.user.budgets.push(newBudget._id);
  await req.user.save();
  res.redirect(`/budget/${newBudget._id}`);
};

// RENDER BUDGET SHOW PAGE
module.exports.showBudget = async (req, res) => {
  const { budgetId } = req.params;
  try {
    const foundBudget = await Budget.findById(budgetId)
      .populate("expenses")
      .populate({
        path: "user",
        populate: { path: "budgets" }
      });
    if (!foundBudget) {
      res.status(404).render("pages/404");
    }
    else {
      if (req.user && req.user._id.equals(foundBudget.user._id)) {
        res.render("budgets/show", { foundBudget });
      } else {
        res.status(403).render("pages/403");
      }      
    }
  }
  catch (err) {
    if (err.name === "CastError") {
      res.status(404).render("pages/404");
    }
    else {
      res.status(500).render("pages/error");
    }
  }
};




