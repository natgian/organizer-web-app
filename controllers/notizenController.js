const { Note } = require("../models/note");

// Render Listen Index Page
module.exports.index = async (req, res) => {
  res.render("pages/notizen");
};

// Render New NOte Page
module.exports.renderNewNote = (req, res) => {
  res.render("notes/new");
};