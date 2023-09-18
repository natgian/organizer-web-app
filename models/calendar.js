const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;