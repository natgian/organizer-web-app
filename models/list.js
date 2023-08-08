const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item"
    }
  ],
  color: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

module.exports = { Item, List};