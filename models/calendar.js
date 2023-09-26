const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startEventTime: {
    type: String
  },
  endEventTime: {
    type: String
  },
  color: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;