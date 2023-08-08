const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Requiring routes
const listenRoutes = require("./routes/listenRoutes");
const notizenRoutes = require("./routes/notizenRoutes");

// Connecting Mongoose to MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/taskmanagerApp");
  console.log("Connected to MongoDB database");
}

// Setting the view engine and path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Sessions
const sessionConfig = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

// Passport
app.use(passport.initialize());
app.use(passport.session()); // must be used AFTER sessions
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES

// General routes
app.get("/", (req, res) => {
  res.render("index");
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

app.get("/404", (req, res) => {
  res.status(404).render("pages/404");
});

// Required routes
app.use("/listen", listenRoutes);
app.use("/notizen", notizenRoutes);


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
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});


