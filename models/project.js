const mongoose = require("mongoose");

const ToDosSchema = new mongoose.Schema({
  todos: {
    type: String,
    required: true
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
  toDos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToDos"
    }
  ],
  links: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Links"
    }
  ],
  projectBudget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectBudget"
    },
});

const Project = mongoose.model("Project", ProjectSchema);
const ToDo = mongoose.model("ToDo", ToDosSchema);
const Link = mongoose.model("Link", LinkSchema);
const ProjectExpense = mongoose.model("ProjectExpense", ProjectExpenseSchema);
const ProjectBudget = mongoose.model("ProjectBudget", ProjectBudgetSchema);

module.exports = { Project, ToDo, Link, ProjectExpense, ProjectBudget };