const { Item, List } = require("../models/list");

// Render Listen Index Page
module.exports.index = async (req, res, next) => {
  const lists = await List.find({});
  res.render("pages/listen", { lists });
};

// Render New List Page
module.exports.renderNewList = (req, res) => {
  res.render("lists/new");
};

// Create a New List
module.exports.createList = async (req, res) => {
  const newList = new List(req.body);
  await newList.save();
  res.redirect(`/listen/${newList._id}`);
};

// Render Listen Show Page
module.exports.showList = async (req, res) => {
  const { id } = req.params;
  try {
    const foundList = await List.findById(id).populate("items");
    if (!foundList) {
      res.status(404).render("pages/404");
    }
    else {
      res.render("lists/show", { foundList });
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

// Render Listen Edit Page
module.exports.renderEditList = async (req, res) => {
  const { id } = req.params;
  const foundList = await List.findById(id);
  res.render("lists/edit", { foundList });
};

// Edit a List
module.exports.editList = async (req, res) => {
  const { id } = req.params;
  const list = await List.findByIdAndUpdate(id, req.body, { runValidators: true });
  res.redirect(`/listen/${list._id}`);
};

// Delete a List
module.exports.deleteList = async (req, res) => {
  const { id } = req.params;
  const foundList = await List.findById(id);
  const itemIds = foundList.items;
  await Item.deleteMany({ _id: { $in: itemIds } });
  await List.findByIdAndDelete(id);
  res.redirect("/listen");
};

// Add new item to a list
module.exports.addNewListItem = async (req, res) => {
  const { id } = req.params;
  const newItem = new Item({ name: req.body.name });
  const savedItem = await newItem.save();
  const foundList = await List.findById(id);
  foundList.items.push(savedItem);
  await foundList.save();
  res.redirect(`/listen/${foundList._id}`);
}

// Delete item from a list
module.exports.deleteItemFromList = async (req, res) => {
  const { listId, itemId } = req.params;
  const foundList = await List.findById(listId);

  // Check if the item exists in the list's items array
  const itemIndex = foundList.items.indexOf(itemId);

  if (itemIndex !== -1) {
    // Remove the item from the list's items array
    foundList.items.splice(itemIndex, 1);
  };

  await foundList.save();
  await Item.findByIdAndDelete(itemId);
  res.redirect(`/listen/${listId}`);
};



