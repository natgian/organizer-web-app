const mongoose = require("mongoose");

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
  transactions: [
    {
      transactionDate: {
        type: Date,
        required: true,
      },
      transactionDescription: {
        type: String,
        required: true,
      },
      transactionAmount: {
        type: Number,
        required: true,
      },
      transactionType: {
        type: String,
        enum: ["expense", "revenue"],
        required: true,
      },
    },
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

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = { Budget };
