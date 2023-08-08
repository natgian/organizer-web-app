const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }, 
  password: {
    type: String,
    required: true
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: "List"
  }],
  notes: [{
    type: Schema.Types.ObjecId,
    ref: "Note"
  }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;