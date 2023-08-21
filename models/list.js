const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

const ListSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Item = mongoose.model("Item", ItemSchema);
const List = mongoose.model("List", ListSchema);

module.exports = { Item, List};