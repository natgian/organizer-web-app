const Calendar = require("../models/calendar");
const User = require("../models/user");


// RENDER NEW CALENDAR EVENT PAGE
module.exports.renderNewEvent = (req, res) => {
  const errorMessage = req.flash("error");
  res.render("calendar/new", { errorMessage });
};

// CREATE A NEW CALENDAR EVENT
module.exports.createEvent = async (req, res) => {
  const newEvent = new Calendar(req.body);
  newEvent.user = req.user._id;

  await newEvent.save();

  req.user.calendar.push(newEvent._id);
  await req.user.save();

  res.redirect("/kalender");
};

// LOAD CALENDAR EVENTS
module.exports.loadEvents = async (req, res) => {
  const events = await Calendar.find({ user: req.user._id });
  res.json(events);
};

// RENDER CALENDAR PAGE
module.exports.renderCalendarPage = async (req, res) => {
  res.render("calendar/kalender");
};

// DELETE A CALENDAR EVENT
module.exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;
  await Calendar.findByIdAndDelete(eventId);
  await User.findByIdAndUpdate(req.user._id, { $pull: { calendar: eventId } });
  res.sendStatus(200);
};


// TODO: RENDER CALENDAR EVENT EDIT PAGE
// module.exports.renderEditNote = async (req, res, next) => {
//   const { noteId } = req.params;
//   const foundNote = await Note.findById(noteId);
//   res.render("notes/edit", { foundNote });
// };

// TODO:EDIT A CALENDAR EVENT
// module.exports.editNote = async (req, res) => {
//   const { noteId } = req.params;
//   const foundNote = await Note.findByIdAndUpdate(noteId, {... req.body, updatedAt: Date.now()}, { runValidators: true });
//   res.redirect("/notizen");
// };



// TODO: SEARCH CALENDAR EVENT
// module.exports.searchNotesSubmit = async (req, res) => {
//   const noteMaxLength = 150;
//   let searchTerm = req.body.searchTerm;
//   const filteredSearchTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
  
//   const searchResults = await Note.find(
//     {
//     "$or": [
//       {title: {$regex: new RegExp(filteredSearchTerm, "i")}},
//       {body: {$regex: new RegExp(filteredSearchTerm, "i")}}
//     ]
//   });
//   searchResults.forEach(note => {
//     if (note.body.length > noteMaxLength) {
//       note.body = note.body.substring(0, noteMaxLength) + "...";
//     };
//   })
//   res.render("notes/search", { searchResults });
// };




