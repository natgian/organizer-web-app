const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "List"
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  }],
  budgets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget"
  }],
  calendar: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
  }]
});

// Adding a field for username/email and password to the schema
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", UserSchema);

module.exports = User;