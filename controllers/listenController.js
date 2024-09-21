const { Item, List } = require("../models/list");
const User = require("../models/user");

// RENDER LISTEN PAGE
module.exports.renderListenPage = async (req, res, next) => {
  const lists = await List.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .populate("user");
  res.render("pages/listen", { lists, foundUser: req.user });
};

// RENDER NEW LIST PAGE
module.exports.renderNewList = (req, res, next) => {
  res.render("lists/newList", { foundUser: req.user });
};

// CREATE A NEW LIST
module.exports.createList = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const newList = new List(req.body);
  newList.user = req.user._id;
  await newList.save();
  req.user.lists.push(newList._id);
  await req.user.save();
  res.redirect(`/listen/${newList._id}`);
};

// RENDER LISTEN SHOW PAGE
module.exports.showList = async (req, res, next) => {
  const { listId } = req.params;
  try {
    const foundList = await List.findById(listId)
      .populate("items")
      .populate({
        path: "user",
        populate: { path: "lists" },
      });
    if (!foundList) {
      res.status(404).render("pages/404");
    } else {
      if (req.user && req.user._id.equals(foundList.user._id)) {
        res.render("lists/showList", { foundList });
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

// RENDER LISTEN EDIT PAGE
module.exports.renderEditList = async (req, res, next) => {
  const { listId } = req.params;
  const foundList = await List.findById(listId);
  res.render("lists/editList", { foundList, foundUser: req.user });
};

// EDIT A LIST
module.exports.editList = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { listId } = req.params;
  const foundList = await List.findByIdAndUpdate(
    listId,
    { ...req.body, updatedAt: Date.now() },
    { runValidators: true }
  );
  res.redirect(`/listen/${foundList._id}`);
};

// DELETE A LIST
module.exports.deleteList = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { listId } = req.params;

  const foundList = await List.findById(listId);
  const itemIds = foundList.items;

  await Item.deleteMany({ _id: { $in: itemIds } });
  await List.findByIdAndDelete(listId);
  await User.findByIdAndUpdate(req.user._id, { $pull: { lists: listId } });
  res.redirect("/listen");
};

// ADD NEW ITEM TO A LIST
module.exports.addNewListItem = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { listId } = req.params;
  const newItem = new Item({ text: req.body.text });
  const savedItem = await newItem.save();
  const foundList = await List.findById(listId);
  foundList.items.push(savedItem);
  foundList.updatedAt = Date.now();
  await foundList.save();
  res.redirect(`/listen/${foundList._id}`);
};

// DELETE ITEM FROM A LIST
module.exports.deleteItemFromList = async (req, res, next) => {
  if (req.user && req.user.username === "Demo User") {
    return res.status(403).render("pages/403");
  }

  const { listId, itemId } = req.params;

  const foundList = await List.findById(listId);
  const itemIndex = foundList.items.indexOf(itemId); // Check if the item exists in the list's items array

  if (itemIndex !== -1) {
    foundList.items.splice(itemIndex, 1); // Remove the item from the list's items array
    foundList.updatedAt = Date.now();
    await foundList.save();
    await Item.findByIdAndDelete(itemId);

    res.redirect(`/listen/${listId}`);
  } else {
    res.status(404).render("pages/404");
  }
};
