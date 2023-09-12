const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expense: {
    type: Number,
    required: true
  }
});

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
  },
  remainingBudget: {
    type: Number,
    required: true
  },
  expenses: [expenseSchema]   
});

const Expense = mongoose.model("Expense", expenseSchema);
const Budget = mongoose.model("Budget", budgetSchema);

module.exports = { Expense, Budget};