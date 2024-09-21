const { Project, Todo, ProjectBudget } = require("../models/project");
const User = require("../models/user");
const formatDate = require("../utilities/formatDate");

// RENDER PROJECT PAGE
module.exports.renderProjektePage = async (req, res, next) => {
  const projects = await Project.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .populate("user");
  res.render("pages/projekte", { projects, foundUser: req.user });
};

// RENDER NEW PROJECT PAGE
module.exports.renderNewProject = (req, res, next) => {
  res.render("projects/newProject", { foundUser: req.user });
};

// CREATE A NEW PROJECT
module.exports.createProject = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const newProject = new Project(req.body);
  newProject.user = req.user._id;
  await newProject.save();
  req.user.projects.push(newProject._id);
  await req.user.save();
  res.redirect(`/projekte/${newProject._id}`);
};

// RENDER PROJECT SHOW PAGE
module.exports.showProject = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const foundProject = await Project.findById(projectId)
      .populate({
        path: "user",
        populate: { path: "projects" },
      })
      .populate("todos")
      .populate("projectbudget");

    if (!foundProject) {
      res.status(404).render("pages/404");
    } else {
      // Ensure the projectbudget is populated and projectTransactions exist
      if (
        foundProject.projectbudget &&
        foundProject.projectbudget.projectTransactions
      ) {
        // Sort the projectTransactions by date (oldest first)
        foundProject.projectbudget.projectTransactions.sort(
          (a, b) => a.projectTransactionDate - b.projectTransactionDate
        );
      }

      if (req.user && req.user._id.equals(foundProject.user._id)) {
        // Calculate the todo counts
        const completedCount = await Todo.countDocuments({
          project: projectId,
          completed: true,
        });
        const openCount = await Todo.countDocuments({
          project: projectId,
          completed: false,
        });
        res.render("projects/showProject", {
          foundProject,
          formatDate,
          completedCount,
          openCount,
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

// ADD NEW PROJECT TODO
module.exports.addNewProjectTodo = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;

  const newToDo = new Todo({ text: req.body.text, project: projectId });
  const savedToDo = await newToDo.save();

  const foundProject = await Project.findById(projectId);

  foundProject.todos.push(savedToDo);
  foundProject.updatedAt = Date.now();

  await foundProject.save();

  res.redirect(`/projekte/${foundProject._id}#todo-section`);
};

// HANDLE TODOS COMPLETION STATE
module.exports.toggleTodoCompletion = async (req, res, next) => {
  const { todoId, projectId } = req.params;
  const foundProject = await Project.findById(projectId);
  const foundTodo = await Todo.findById(todoId);
  // check if there is a todo
  if (!foundTodo) {
    return res.status(404).send("Aufgabe nicht gefunden.");
  }
  // Toggle completion state
  foundTodo.completed = !foundTodo.completed;
  await foundTodo.save();
  // Update the "updatedAt" date of the project
  foundProject.updatedAt = Date.now();
  await foundProject.save();
  // Get the updated count of completed and open todos
  const completedCount = await Todo.countDocuments({
    project: req.params.projectId,
    completed: true,
  });
  const openCount = await Todo.countDocuments({
    project: req.params.projectId,
    completed: false,
  });
  // Send the updated counts as JSON response
  res.json({ success: true, todo: foundTodo, completedCount, openCount });
};

// HANDLE TODOS COUNT STATE
module.exports.updateTodoCount = async (req, res, next) => {
  const { projectId } = req.params;
  const foundProject = await Project.findById(projectId);

  if (!foundProject) {
    res.status(404).render("pages/404");
  } else {
    if (req.user && req.user._id.equals(foundProject.user._id)) {
      // Calculate the todo counts
      const completedCount = await Todo.countDocuments({
        project: projectId,
        completed: true,
      });
      const openCount = await Todo.countDocuments({
        project: projectId,
        completed: false,
      });
      res.json({ success: true, completedCount, openCount });
    } else {
      res.status(403).render("pages/403");
    }
  }
};

// ADD NEW PROJECT BUDGET
module.exports.addProjectBudget = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;
  const { projectBudget } = req.body;

  const newProjectBudget = new ProjectBudget({
    projectBudget,
    remainingProjectBudget: projectBudget,
  });

  await newProjectBudget.save();

  const foundProject = await Project.findById(projectId);

  if (!foundProject) {
    return res.status(404).send("Project nicht gefunden");
  }

  foundProject.projectbudget = newProjectBudget._id;
  foundProject.updatedAt = Date.now();
  await foundProject.save();

  res.redirect(`/projekte/${foundProject._id}#budget-section`);
};

// ADD PROJECT BUDGET TRANSACTION
module.exports.addProjectBudgetTransaction = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;
  const foundProject = await Project.findById(projectId).populate(
    "projectbudget"
  );
  const projectBudget = foundProject.projectbudget;

  const {
    projectTransactionDate,
    projectTransactionDescription,
    projectTransactionAmount,
    projectTransactionType,
  } = req.body;
  const newTransaction = {
    projectTransactionDate,
    projectTransactionDescription,
    projectTransactionAmount,
    projectTransactionType,
  };

  projectBudget.projectTransactions.push(newTransaction);

  if (projectTransactionType === "expense") {
    projectBudget.remainingProjectBudget -= parseFloat(
      projectTransactionAmount
    );
  } else if (projectTransactionType === "revenue") {
    projectBudget.remainingProjectBudget += parseFloat(
      projectTransactionAmount
    );
  }
  await projectBudget.save();

  foundProject.updatedAt = Date.now();
  await foundProject.save();

  res.redirect(`/projekte/${foundProject._id}#budget-section`);
};

// RENDER PROJECT EDIT PAGE
module.exports.renderEditProject = async (req, res, next) => {
  const { projectId } = req.params;
  const foundProject = await Project.findById(projectId);
  res.render("projects/editProject", { foundProject, foundUser: req.user });
};

// EDIT A PROJECT
module.exports.editProject = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;
  const foundProject = await Project.findByIdAndUpdate(
    projectId,
    { ...req.body, updatedAt: Date.now() },
    { runValidators: true }
  );
  res.redirect(`/projekte/${foundProject._id}`);
};

// EDIT A PROJECT BUDGET
module.exports.editProjectBudget = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId, budgetId } = req.params;
  const { newProjectBudget } = req.body;
  const foundProject = await Project.findById(projectId);
  const foundProjectBudget = await ProjectBudget.findById(budgetId);
  // getting the total of all expenses in the budget:
  const totalTransactions = foundProjectBudget.projectTransactions.reduce(
    (total, transaction) => total + transaction.projectTransactionAmount,
    0
  );

  foundProjectBudget.projectBudget = newProjectBudget;
  foundProjectBudget.remainingProjectBudget =
    newProjectBudget - totalTransactions;

  await foundProjectBudget.save();

  foundProject.updatedAt = Date.now();
  await foundProject.save();

  res.redirect(`/projekte/${foundProject._id}#budget-section`);
};

// DELETE A PROJECT
module.exports.deleteProject = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);
  const todoIds = foundProject.todos;
  const projectbudgetId = foundProject.projectbudget;
  const projectBudget = await ProjectBudget.findById(projectbudgetId);

  if (projectBudget) {
    await ProjectBudget.findByIdAndDelete(projectbudgetId);
  }

  await Todo.deleteMany({ _id: { $in: todoIds } });
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { projects: projectId },
  });

  await Project.findByIdAndDelete(projectId);
  res.redirect("/projekte");
};

//  DELETE TODO FROM A TODO-LIST
module.exports.deleteTodoFromTodos = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId, todoId } = req.params;

  const foundProject = await Project.findById(projectId);
  const todoIndex = foundProject.todos.indexOf(todoId); // Check if the todo exists in the project's todos array

  if (todoIndex !== -1) {
    foundProject.todos.splice(todoIndex, 1); // Remove the todo from the project's todos array
    foundProject.updatedAt = Date.now();
    await foundProject.save();
    await Todo.findByIdAndDelete(todoId);
    res.redirect(`/projekte/${projectId}#todo-section`);
  } else {
    res.status(404).render("pages/404");
  }
};

// DELETE ALL TODOS FROM A TODO-LIST
module.exports.deleteAllTodos = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);
  const todos = foundProject.todos;

  await Todo.deleteMany({ _id: { $in: todos } });
  foundProject.updatedAt = Date.now();
  await foundProject.save();

  res.redirect(`/projekte/${projectId}#todo-section`);
};

// DELETE TRANSACTION FROM BUDGET
module.exports.deleteProjectBudgetTransaction = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId, transactionId } = req.params;
  const foundProject = await Project.findById(projectId).populate(
    "projectbudget"
  );
  const projectBudget = foundProject.projectbudget;

  const transactionIndex = projectBudget.projectTransactions.findIndex(
    (transaction) => transaction._id.equals(transactionId)
  );

  if (transactionIndex !== -1) {
    const deletedTransaction =
      projectBudget.projectTransactions[transactionIndex];

    if (deletedTransaction.projectTransactionType === "expense") {
      projectBudget.remainingProjectBudget +=
        deletedTransaction.projectTransactionAmount;
    } else if (deletedTransaction.projectTransactionType === "revenue") {
      projectBudget.remainingProjectBudget -=
        deletedTransaction.projectTransactionAmount;
    }

    projectBudget.projectTransactions.splice(transactionIndex, 1);

    await projectBudget.save();
    foundProject.updatedAt = Date.now();
    await foundProject.save();
    res.redirect(`/projekte/${projectId}#budget-section`);
  } else {
    res.status(404).render("pages/404");
  }
};

// DELETE A PROJECT BUDGET
module.exports.deleteProjectBudget = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { projectId } = req.params;
  const foundProject = await Project.findById(projectId);
  const projectBudget = foundProject.projectbudget;

  foundProject.projectbudget = null;
  await ProjectBudget.deleteOne({ _id: projectBudget._id });
  foundProject.updatedAt = Date.now();
  await foundProject.save();
  res.redirect(`/projekte/${projectId}`);
};
