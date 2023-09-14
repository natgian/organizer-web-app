const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
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

const budgetSchema = new mongoose.Schema({
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
  }  
});

const Expense = mongoose.model("Expense", expenseSchema);
const Budget = mongoose.model("Budget", budgetSchema);

module.exports = { Expense, Budget };
