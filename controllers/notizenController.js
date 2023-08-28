const Note = require("../models/note");

// Render Notizen Index Page
module.exports.index = async (req, res) => {
  res.render("pages/notizen");
};

// Render New Note Page
module.exports.renderNewNote = (req, res) => {
  res.render("notes/new");
};