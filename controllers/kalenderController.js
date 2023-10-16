const Calendar = require("../models/calendar");
const User = require("../models/user");
const formatDate = require("../utilities/formatDate");


// RENDER NEW CALENDAR EVENT PAGE
module.exports.renderNewEvent = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("calendar/new", { errorMessage });
};

// CREATE A NEW CALENDAR EVENT
module.exports.createEvent = async (req, res, next) => {
  const newEvent = new Calendar(req.body);
  newEvent.user = req.user._id;

  await newEvent.save();

  req.user.calendar.push(newEvent._id);
  await req.user.save();

  res.redirect("/kalender");
};

// LOAD CALENDAR EVENTS
module.exports.loadEvents = async (req, res, next) => {
  const events = await Calendar.find({ user: req.user._id });
  res.json(events);
};

// RENDER CALENDAR PAGE
module.exports.renderCalendarPage = async (req, res, next) => {
  res.render("calendar/kalender");
};

// DELETE A CALENDAR EVENT
module.exports.deleteEvent = async (req, res, next) => {
  const eventId = req.params.eventId;
  await Calendar.findByIdAndDelete(eventId);
  await User.findByIdAndUpdate(req.user._id, { $pull: { calendar: eventId } });
  res.sendStatus(200);
};

// SEARCH CALENDAR EVENT
module.exports.searchEventSubmit = async (req, res, next) => {
  let searchTerm = req.body.searchTerm;
  const filteredSearchTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

  const searchResults = await Calendar.find({
    title: { $regex: new RegExp(filteredSearchTerm, "i") }
  });

  if (searchResults.length === 0) {
    req.flash("info", "Keine Einträge gefunden");
  };
  res.render("calendar/search", { searchResults, formatDate, filteredSearchTerm });
};




