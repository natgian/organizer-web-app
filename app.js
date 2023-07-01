const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// Connecting Mongoose to MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/taskmanagerApp");
  console.log("Connected to MongoDB database");
}

// Setting the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("./public"));


// ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
})

app.get("/registration", (req, res) => {
  res.render("pages/registration");
})

app.get("/login", (req, res) => {
  res.render("pages/login");
})

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});


