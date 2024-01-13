const Calendar = require("../models/calendar");
const User = require("../models/user");
const formatDate = require("../utilities/formatDate");


// RENDER NEW CALENDAR EVENT PAGE
module.exports.renderNewEvent = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("calendar/newCalendarEvent", { errorMessage });
};

// CREATE A NEW CALENDAR EVENT
module.exports.createEvent = async (req, res, next) => {
  const eventData = req.body;
  eventData.user = req.user._id;

  if (eventData.reccurence === "yearly") {
    // If present, set the recurrence to 'yearly'
    eventData.recurrence = 'yearly';

    // Create entries for the next 5 years
    for (let i = 0; i < 10; i++) {
      const newStartDate = new Date(eventData.startDate);
      const newEndDate = new Date(eventData.endDate);

      newStartDate.setFullYear(newStartDate.getFullYear() + i);
      newEndDate.setFullYear(newEndDate.getFullYear() + i);

      // Create a new event entry for each occurrence
      const newEvent = new Calendar({
        ...eventData,
        startDate: newStartDate,
        endDate: newEndDate
      });

      await newEvent.save();

      // Update the user's calendar
      req.user.calendar.push(newEvent._id);
      await req.user.save();
    }
  } else {
    // If not present or has a different recurrence pattern, save it as a single event
    const newEvent = new Calendar(eventData);
    await newEvent.save();

    // Update the user's calendar
    req.user.calendar.push(newEvent._id);
    await req.user.save();
  }

  res.redirect('/kalender');
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

  const userId = req.user._id;

  const searchResults = await Calendar.find({
    $and: [
      { title: { $regex: new RegExp(filteredSearchTerm, "i") } },
      { user: userId }, // Add this condition to filter by user ID
    ],
  });
  // Sort the searchResults by date
  searchResults.sort((eventA, eventB) => {
    // Assuming you have a date or startDate property
    const dateA = eventA.date || eventA.startDate;
    const dateB = eventB.date || eventB.startDate;
    // Compare events based on their date
    return dateA - dateB;
  });

  if (searchResults.length === 0) {
    req.flash("info", "Keine Einträge gefunden");
  };
  res.render("calendar/searchCalendarEvent", { searchResults, formatDate, filteredSearchTerm });
};




