const Calendar = require("../models/calendar");
const User = require("../models/user");


// TODO: RENDER NEW CALENDAR EVENT PAGE
// module.exports.renderNewNote = (req, res) => {
//   const errorMessage = req.flash("error");
//   res.render("notes/new", { errorMessage });
// };

// TODO: CREATE A NEW CALENDAR EVENT
// module.exports.createNote = async (req, res) => {
//   const newNote = new Note(req.body);
//   newNote.user = req.user._id;
//   newNote.createdAt = new Date();
//   newNote.updatedAt = new Date();

//   await newNote.save();

//   req.user.notes.push(newNote._id);
//   await req.user.save();

//   res.redirect("/notizen");
// };

// TODO: RENDER SHOW CALENDAR EVENT ON CLICK


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

// TODO: DELETE A CALENDAR EVENT
// module.exports.deleteNote = async (req, res) => {
//   const { noteId } = req.params;

//   await Note.findByIdAndDelete(noteId);
//   await User.findByIdAndUpdate(req.user._id, { $pull: { notes: noteId } });
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




