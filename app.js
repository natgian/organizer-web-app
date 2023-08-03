const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// Requiring routes
const listenRoutes = require("./routes/listen");

// Connecting Mongoose to MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/taskmanagerApp");
  console.log("Connected to MongoDB database");
}

// Setting the view engine and path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares and static files
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ROUTES

// General routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/404", (req, res) => {
  res.status(404).render("pages/404");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
});

app.get("/timer", (req, res) => {
  res.render("pages/timer");
});

app.get("/registration", (req, res) => {
  res.render("pages/registration");
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

// Required routes
app.use("/listen", listenRoutes);


// ERROR HANDLING

// General Error Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).render("pages/404");
});

// Error Handler for other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", {err: err});
});

// SERVER
app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});


