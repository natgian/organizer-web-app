const User = require("../models/user");
const { Expense, Budget } = require("../models/budget");
const formatDate  = require("../utilities/formatDate");

// RENDER BUDGET PAGE
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
  const newBudgetData = req.body;
  newBudgetData.user = req.user._id;
  newBudgetData.remainingBudget = newBudgetData.budget;

  const newBudget = new Budget(newBudgetData);
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
        res.render("budgets/show", { foundBudget, formatDate });
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

// RENDER BUDGET EDIT PAGE
module.exports.renderEditBudget = async (req, res, next) => {
  const { budgetId } = req.params;
  const foundBudget = await Budget.findById(budgetId);
  res.render("budgets/edit", { foundBudget });
};

// EDIT A BUDGET
module.exports.editBudget = async (req, res) => {
  const { budgetId } = req.params;
  const foundBudget = await Budget.findByIdAndUpdate(budgetId, req.body, { runValidators: true });
  res.redirect(`/budget/${foundBudget._id}`);
};

// DELETE A BUDGET
module.exports.deleteBudget = async (req, res) => {
  const { budgetId } = req.params;

  const foundBudget = await Budget.findById(budgetId);
  const expenseIds = foundBudget.expenses;

  await Expense.deleteMany({ _id: { $in: expenseIds } });
  await Budget.findByIdAndDelete(budgetId);
  await User.findByIdAndUpdate(req.user._id, { $pull: { budgets: budgetId } });
  res.redirect("/budget");
};

// ADD NEW EXPENSE TO A BUDGET
module.exports.addNewExpense = async (req, res) => {
  const { budgetId } = req.params;
  const newExpense = new Expense({ date: req.body.date, description: req.body.description, expense: req.body.expense });
  const savedExpense = await newExpense.save();
  const foundBudget = await Budget.findById(budgetId);
  foundBudget.expenses.push(savedExpense);
  await foundBudget.save();
  res.redirect(`/budget/${foundBudget._id}`);
};

// DELETE EXPENSE FROM A BUDGET
module.exports.deleteExpenseFromBudget = async (req, res) => {
  const { budgetId, expenseId } = req.params;

  const foundBudget = await Budget.findById(budgetId);
  console.log("foundBudget:", foundBudget);
  const expenseIndex = foundBudget.expenses.indexOf(expenseId); // Check if the item exists in the list's items array
  console.log("expenseIndex:", expenseIndex);

  if (expenseIndex !== -1) {
    foundBudget.expenses.splice(expenseIndex, 1);// Remove the item from the list's items array
    await foundBudget.save();
    await Expense.findByIdAndDelete(expenseId);
    await User.findByIdAndUpdate(req.user._id, { $pull: { budgets: budgetId } });
    res.redirect(`/budget/${budgetId}`);
  } else {
      res.status(404).render("pages/404");
  }
};




