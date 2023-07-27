const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: {
    type: Array,
  },
  color: {
    type: String,
  }
});

module.exports = mongoose.model("List", listSchema);