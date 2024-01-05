const mongoose = require("mongoose");

const TodosSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
});

const ProjectBudgetSchema = new mongoose.Schema({
  projectBudget: {
    type: Number,
    required: true,
  },
  remainingProjectBudget: {
    type: Number,
  },
  projectTransactions: [
    {
      projectTransactionDate: {
        type: Date,
        required: true,
      },
      projectTransactionDescription: {
        type: String,
        required: true,
      },
      projectTransactionAmount: {
        type: Number,
        required: true,
      },
      projectTransactionType: {
        type: String,
        enum: ["expense", "revenue"],
        required: true,
      },
    },
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
  projectbudget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectBudget"
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", ProjectSchema);
const Todo = mongoose.model("Todo", TodosSchema);
const ProjectBudget = mongoose.model("ProjectBudget", ProjectBudgetSchema);

module.exports = { Project, Todo, ProjectBudget };