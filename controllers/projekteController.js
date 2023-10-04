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
      });
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
  const { projectId} = req.params;
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
      res.status(500).render("pages/error", { err});
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

  res.redirect(`/projekte/${foundProject._id}/aufgaben`);
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

// // RENDER LISTEN EDIT PAGE
// module.exports.renderEditList = async (req, res, next) => {
//   const { listId } = req.params;
//   const foundList = await List.findById(listId);
//   res.render("lists/edit", { foundList });
// };

// // EDIT A LIST
// module.exports.editList = async (req, res) => {
//   const { listId } = req.params;
//   const foundList = await List.findByIdAndUpdate(listId, req.body, { runValidators: true });
//   res.redirect(`/listen/${foundList._id}`);
// };

// // DELETE A LIST
// module.exports.deleteList = async (req, res) => {
//   const { listId } = req.params;

//   const foundList = await List.findById(listId);
//   const itemIds = foundList.items;

//   await Item.deleteMany({ _id: { $in: itemIds } });
//   await List.findByIdAndDelete(listId);
//   await User.findByIdAndUpdate(req.user._id, { $pull: { lists: listId } });
//   res.redirect("/listen");
// };



// // DELETE ITEM FROM A LIST
// module.exports.deleteItemFromList = async (req, res) => {
//   const { listId, itemId } = req.params;

//     const foundList = await List.findById(listId);
//     const itemIndex = foundList.items.indexOf(itemId); // Check if the item exists in the list's items array

//     if (itemIndex !== -1) {
//       foundList.items.splice(itemIndex, 1);// Remove the item from the list's items array
//       await foundList.save();
//       await Item.findByIdAndDelete(itemId);
//       await User.findByIdAndUpdate(req.user._id, { $pull: { lists: listId } });

//       res.redirect(`/listen/${listId}`);
//     } else {
//       res.status(404).render("pages/404");
//     }
// };



