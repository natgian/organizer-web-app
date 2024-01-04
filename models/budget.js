const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
});

const BudgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String
  },
  budget: {
    type: Number
  },
  remainingBudget: {
    type: Number
  },
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense"
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedAt: {
    type: Date,
    default: Date.now
  } 
});

const Expense = mongoose.model("Expense", ExpenseSchema);
const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = { Expense, Budget };
