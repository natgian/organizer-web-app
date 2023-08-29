const Note = require("../models/note");

// RENDER NOTIZEN INDEX PAGE
module.exports.index = async (req, res, next) => {
  const notes = await Note.find({ user: req.user._id }).populate("user");
  res.render("pages/notizen", { notes });
};

// RENDER NEW NOTE PAGE
module.exports.renderNewNote = (req, res) => {
  res.render("notes/new");
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

// RENDER NOTIZ SHOW PAGE
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
        res.render("notes/show", { foundNote });
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

// TODO: RENDER NOTE EDIT PAGE

// TODO: EDIT A NOTE

// TODO: DELETE A NOTE




