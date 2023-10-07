const { Project, Todo, Link, ProjectExpense, ProjectBudget } = require("../models/project");
const User = require("../models/user");

// RENDER PROJECTS PAGE
module.exports.renderProjektePage = async (req, res, next) => {
  const projects = await Project.find({ user: req.user._id }).populate("user");
  res.render("pages/projekte", { projects });
};

// RENDER NEW PROJECT PAGE
module.exports.renderNewProject = (req, res) => {
  res.render("projects/newProject");
};

// CREATE A NEW PROJECT
module.exports.createProject = async (req, res) => {
  const newProject = new Project(req.body);
  newProject.user = req.user._id;
  await newProject.save();
  req.user.projects.push(newProject._id);
  await req.user.save();
  res.redirect(`/projekte/${newProject._id}`);
};

// RENDER PROJECT SHOW PAGE
module.exports.showProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const foundProject = await Project.findById(projectId)
      .populate({
        path: "user",
        populate: { path: "projects" }
      })
      .populate("todos");

    if (!foundProject) {
      res.status(404).render("pages/404");
    }
    else {
      if (req.user && req.user._id.equals(foundProject.user._id)) {
        res.render("projects/showProject", { foundProject });
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

// RENDER PROJECT TODOS SHOW PAGE
module.exports.showProjectToDos = async (req, res) => {
  const { projectId } = req.params;
  try {
    const foundProject = await Project.findById(projectId)
      .populate("todos")
      .populate({
        path: "user",
        populate: { path: "projects" }
      });
    if (!foundProject) {
      res.status(404).render("pages/404");
    }
    else {
      if (req.user && req.user._id.equals(foundProject.user._id)) {
        res.render("projects/showProjectToDos", { foundProject });
      } else {
        res.status(403).render("pages/403");
      }
    }
  }
  catch (err) {
    if (err.name === "CastError") {
      res.status(404).render("pages/404", { err });
    }
    else {
      res.status(500).render("pages/error", { err });
    }
  }
};

// ADD NEW PROJECT TODO
module.exports.addNewProjectTodo = async (req, res) => {
  const { projectId } = req.params;

  const newToDo = new Todo({ text: req.body.text });
  const savedToDo = await newToDo.save();

  const foundProject = await Project.findById(projectId);

  foundProject.todos.push(savedToDo);

  await foundProject.save();

  res.redirect(`/projekte/${foundProject._id}`);
};

// HANDLE TODOS COMPLETION STATE
module.exports.toggleTodoCompletion = async (req, res) => {
  const { projectId, todoId } = req.params;

  const foundProject = await Project.findById(projectId);
  const foundTodo = await Todo.findById(todoId);

  if (!foundTodo) {
    return res.status(404).send("ToDo not found");
  };

  foundTodo.completed = !foundTodo.completed;
  await foundTodo.save();
  res.json({ success: true });
};

// RENDER PROJECT EDIT PAGE
module.exports.renderEditProject = async (req, res, next) => {
  const { projectId } = req.params;
  const foundProject = await Project.findById(projectId);
  res.render("projects/editProject", { foundProject });
};

// EDIT A PROJECT
module.exports.editProject = async (req, res) => {
  const { projectId } = req.params;
  const foundProject = await Project.findByIdAndUpdate(projectId, req.body, { runValidators: true });
  res.redirect(`/projekte/${foundProject._id}`);
};

// DELETE A PROJECT
module.exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);
  const todoIds = foundProject.todos;
  const projectbudgetId = foundProject.projectbudget;
  const linkIds = foundProject.links;

  const projectBudget = await ProjectBudget.findById(projectbudgetId);
  if (projectBudget) {
    const projectexpenseIds = projectBudget.projectExpenses;
    await ProjectExpense.deleteMany({ _id: { $in: projectexpenseIds } });
    await ProjectBudget.findByIdAndDelete(projectbudgetId);
  };

  await Todo.deleteMany({ _id: { $in: todoIds } });
  await Link.deleteMany({ _id: { $in: linkIds } });
  await User.findByIdAndUpdate(req.user._id, { $pull: { projects: projectId } });

  await Project.findByIdAndDelete(projectId);
  res.redirect("/projekte");
};

//  DELETE TODO FROM A TODO-LIST
module.exports.deleteTodoFromTodos = async (req, res) => {
  const { projectId, todoId } = req.params;

  const foundProject = await Project.findById(projectId);
  const todoIndex = foundProject.todos.indexOf(todoId); // Check if the todo exists in the project's todos array

  if (todoIndex !== -1) {
    foundProject.todos.splice(todoIndex, 1);// Remove the todo from the project's todos array
    await foundProject.save();
    await Todo.findByIdAndDelete(todoId);

    res.redirect(`/projekte/${projectId}`);
  } else {
    res.status(404).render("pages/404");
  }
};

// DELETE ALL TODOS FROM A TODO-LIST
module.exports.deleteAllTodos = async (req, res) => {
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);
  const todos = foundProject.todos;

  await Todo.deleteMany({ _id: { $in: todos } });
  await foundProject.save();

  res.redirect(`/projekte/${projectId}`);
};



