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
  }
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

module.exports = { Item, List};