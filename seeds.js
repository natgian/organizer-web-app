const mongoose = require("mongoose");
const Note = require("./models/note");

// Connecting Mongoose to MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/taskmanagerApp");
  console.log("Connected to MongoDB database");
};



const note = new Note({
  title: "Coden lernen",
  body: "Das ist ein Test um zu sehen ob diese Notiz richtig funktioniert...",
  user: "64dd13e43b1e6d0367b37a4c"
});

note.save()
.then(note => {
  console.log(note);
})
.catch(e => {
  console.log(e);
});
