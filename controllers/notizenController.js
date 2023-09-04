const Note = require("../models/note");
const User = require("../models/user");

// RENDER NOTIZEN INDEX PAGE
module.exports.index = async (req, res, next) => {
  // Get the requested page number from query parameter:
  const currentPage = parseInt(req.query.page) || 1; 
  const notesPerPage = 4;
  const startIndex = (currentPage - 1) * notesPerPage;
  const totalNotes = await Note.countDocuments({ user: req.user._id });
  const noteMaxLength = 150;

  const notes = await Note.find({ user: req.user._id })
    .skip(startIndex) // skips the number of documents equal to the startIndex
    .limit(notesPerPage) // limits the number of returned documents to notesPerPage
    .populate("user"); // populate the user field in each note document with the associated user object

 notes.forEach(note => {
  if(note.body.length > noteMaxLength) {
    note.body = note.body.substring(0, noteMaxLength) + "...";
  };
 })
  res.render("pages/notizen", { notes, currentPage, pages: Math.ceil(totalNotes / notesPerPage) });
};

// RENDER NEW NOTE PAGE
module.exports.renderNewNote = (req, res) => {
  const errorMessage = req.flash("error");
  res.render("notes/new", {errorMessage});
};

// CREATE A NEW NOTE
module.exports.createNote = async (req, res) => {
  const newNote = new Note(req.body);
  newNote.user = req.user._id;
  await newNote.save();
  req.user.notes.push(newNote._id);
  await req.user.save();
  res.redirect(`/notizen/${newNote._id}`);
};

// RENDER SINGLE NOTE SHOW PAGE
module.exports.showNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const foundNote = await Note.findById(noteId)
      .populate("title")
      .populate("body")
      .populate({
        path: "user",
        populate: { path: "notes" }
      });

    if (!foundNote) {
      res.status(404).render("pages/404");
    }
    else {
      if (req.user && req.user._id.equals(foundNote.user._id)) {
        res.render("notes/show", { foundNote});
      } else {
        res.status(403).render("pages/403");
      }      
    }
  }
  catch (err) {
    if (err.name === "CastError") {
      res.status(404).render("pages/404");
    }
    else {
      res.status(500).render("pages/error");
    }
  }
};

// RENDER NOTE EDIT PAGE
module.exports.renderEditNote = async (req, res, next) => {
  const { noteId } = req.params;
  const foundNote = await Note.findById(noteId);
  res.render("notes/edit", { foundNote });
};

// EDIT A NOTE
module.exports.editNote = async (req, res) => {
  const { noteId } = req.params;
  const foundNote = await Note.findByIdAndUpdate(noteId, req.body, { runValidators: true });
  res.redirect(`/notizen/${foundNote._id}`);
};

// DELETE A NOTE
module.exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;

  await Note.findByIdAndDelete(noteId);
  await User.findByIdAndUpdate(req.user._id, { $pull: { notes: noteId } });
  res.redirect("/notizen");
};




