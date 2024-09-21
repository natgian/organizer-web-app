const User = require("../models/user");
const { Budget } = require("../models/budget");
const formatDate = require("../utilities/formatDate");

// RENDER BUDGET PAGE
module.exports.renderBudgetPage = async (req, res, next) => {
  const budgets = await Budget.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .populate("user");
  res.render("pages/budget", { budgets, foundUser: req.user });
};

// RENDER NEW BUDGET PAGE
module.exports.renderNewBudget = (req, res, next) => {
  res.render("budgets/newBudget", { foundUser: req.user });
};

// CREATE A NEW BUDGET
module.exports.createBudget = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

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
module.exports.showBudget = async (req, res, next) => {
  const { budgetId } = req.params;
  try {
    const foundBudget = await Budget.findById(budgetId).populate({
      path: "user",
      populate: { path: "budgets" },
    });
    if (!foundBudget) {
      res.status(404).render("pages/404");
    } else {
      foundBudget.transactions.sort(
        (a, b) => a.transactionDate - b.transactionDate
      ); // Sort the transactions by date (oldest first)

      if (req.user && req.user._id.equals(foundBudget.user._id)) {
        res.render("budgets/showBudget", {
          foundBudget,
          formatDate,
          foundUser: req.user,
        });
      } else {
        res.status(403).render("pages/403");
      }
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(404).render("pages/404");
    } else {
      res.status(500).render("pages/error");
    }
  }
};

// RENDER BUDGET EDIT PAGE
module.exports.renderEditBudget = async (req, res, next) => {
  const { budgetId } = req.params;
  const foundBudget = await Budget.findById(budgetId);
  res.render("budgets/editBudget", { foundBudget, foundUser: req.user });
};

// EDIT A BUDGET
module.exports.editBudget = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { budgetId } = req.params;
  const { budget, name, color } = req.body;
  const foundBudget = await Budget.findById(budgetId);

  if (!foundBudget) {
    return res.status(404).render("pages/404");
  }

  const totalTransactions = foundBudget.transactions.reduce(
    (total, transaction) => {
      if (transaction.transactionType === "expense") {
        return total + parseFloat(transaction.transactionAmount, 10);
      } else if (transaction.transactionType === "revenue") {
        return total - parseFloat(transaction.transactionAmount, 10);
      }
      return total;
    },
    0
  );

  const remainingBudget = budget - totalTransactions;

  foundBudget.budget = budget;
  foundBudget.remainingBudget = remainingBudget;

  if (name !== foundBudget.name) {
    foundBudget.name = name;
  }

  if (color !== undefined && color !== foundBudget.color) {
    foundBudget.color = color;
  }

  foundBudget.updatedAt = Date.now();
  await foundBudget.save();

  res.redirect(`/budget/${budgetId}`);
};

// DELETE A BUDGET
module.exports.deleteBudget = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { budgetId } = req.params;

  const foundBudget = await Budget.findById(budgetId);

  if (!foundBudget) {
    return res.status(404).json({ error: "Budget not found" });
  }

  await Budget.findByIdAndDelete(budgetId);
  await User.findByIdAndUpdate(req.user._id, { $pull: { budgets: budgetId } });
  res.redirect("/budget");
};

// ADD NEW TRANSACTION TO A BUDGET
module.exports.addTransaction = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { budgetId } = req.params;
  const foundBudget = await Budget.findById(budgetId);

  const {
    transactionDate,
    transactionDescription,
    transactionAmount,
    transactionType,
  } = req.body;
  const newTransaction = {
    transactionDate,
    transactionDescription,
    transactionAmount,
    transactionType,
  };

  foundBudget.transactions.push(newTransaction);

  if (transactionType === "expense") {
    foundBudget.remainingBudget -= parseFloat(transactionAmount);
  } else if (transactionType === "revenue") {
    foundBudget.remainingBudget += parseFloat(transactionAmount);
  }

  foundBudget.updatedAt = Date.now();
  await foundBudget.save();
  res.redirect(`/budget/${foundBudget._id}`);
};

// DELETE TRANSACTION FROM A BUDGET
module.exports.deleteTransaction = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { budgetId, transactionId } = req.params;
  const foundBudget = await Budget.findById(budgetId);

  if (!foundBudget) {
    return res.status(404).render("pages/404");
  }

  // Find the index of the transaction within the transactions array
  const transactionIndex = foundBudget.transactions.findIndex((transaction) =>
    transaction._id.equals(transactionId)
  );

  // Get the type and amount of the transaction being deleted
  const { transactionType, transactionAmount } =
    foundBudget.transactions[transactionIndex];

  // Remove the transaction from the transactions array
  foundBudget.transactions.splice(transactionIndex, 1);

  // Recalculate the remaining budget based on the type of the deleted transaction
  if (transactionType === "expense") {
    foundBudget.remainingBudget += transactionAmount; // Add the amount back to the remaining budget
  } else if (transactionType === "revenue") {
    foundBudget.remainingBudget -= transactionAmount; // Subtract the amount from the remaining budget
  }

  // Save the updated budget
  await foundBudget.save();

  // Redirect to the budget page or send a success response
  res.redirect(`/budget/${budgetId}`);
};

// DELETE ALL TRANSACTIONS FROM A BUDGET
module.exports.deleteAllTransactions = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { budgetId } = req.params;

  const foundBudget = await Budget.findById(budgetId);
  if (!foundBudget) {
    return res.status(404).render("pages/404");
  }

  foundBudget.transactions = [];
  foundBudget.remainingBudget = foundBudget.budget;

  await foundBudget.save();

  res.redirect(`/budget/${budgetId}`);
};
