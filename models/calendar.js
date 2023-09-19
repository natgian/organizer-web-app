const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  startEventTime: {
    type: Date
  },
  endEventTime: {
    type: Date
  },
  color: {
    type: String
  }
});

const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;