const mongoose = require("mongoose");

const TodosSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const LinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true
  }
});

const ProjectExpenseSchema = new mongoose.Schema({
  projextExpenseDate: {
    type: Date,
    required: true
  },
  projectExpenseDscription: {
    type: String,
    required: true
  },
  projectExpense: {
    type: Number,
    required: true
  }
});

const ProjectBudgetSchema = new mongoose.Schema({
  projectBudget: {
    type: Number,
    required: true
  },
  remainingProjectBudget: {
    type: Number
  },
  projectExpenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectExpense"
    }
  ],
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  description: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo"
    }
  ],
  links: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link"
    }
  ],
  projectbudget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectBudget"
    },
});

const Project = mongoose.model("Project", ProjectSchema);
const Todo = mongoose.model("Todo", TodosSchema);
const Link = mongoose.model("Link", LinkSchema);
const ProjectExpense = mongoose.model("ProjectExpense", ProjectExpenseSchema);
const ProjectBudget = mongoose.model("ProjectBudget", ProjectBudgetSchema);

module.exports = { Project, Todo, Link, ProjectExpense, ProjectBudget };