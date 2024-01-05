if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
};

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const nodemailer = require("nodemailer");
const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/taskmanagerApp";
const session = require("express-session");
const MongoDBStore = require("connect-mongo");

// Requiring routes
const listenRoutes = require("./routes/listenRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const notizenRoutes = require("./routes/notizenRoutes");
const kalenderRoutes = require("./routes/kalenderRoutes");
const projekteRoutes = require("./routes/projekteRoutes");
const userRoutes = require("./routes/userRoutes");

// Connecting Mongoose to MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
  console.log("Connected to MongoDB database");
};

// Setting the view engine and path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/utilities", express.static(path.join(__dirname, "utilities")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

// Sessions
const secret = process.env.SECRET || "thisismysecret";

const store = MongoDBStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60, // time period in seconds, saying to be updated only one time in a period of 24 hours
  crypto: {
    secret: secret
  }
});

store.on("error", function(err) {
  console.log("SESSION STORE ERROR", err);
});

const sessionConfig = {
  store: store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true --> this says that this cookie should only work over https. ACTIVE IT FOR DEPLOYMENT (not before, since localhost is not https)
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));

// Passport
app.use(passport.initialize());
app.use(passport.session()); // must be used AFTER sessions
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom Middleware
const { isLoggedIn } = require("./middleware");

// Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.loggedInUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  next();
});

// ROUTES
// Required routes
app.use("/listen", listenRoutes);
app.use("/budget", budgetRoutes);
app.use("/notizen", notizenRoutes);
app.use("/kalender", kalenderRoutes);
app.use("/projekte", projekteRoutes);
app.use("/", userRoutes);
// General routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", isLoggedIn, (req, res) => {
  const user = req.user;
  res.render("pages/home", { user });
});

app.get("/timer", isLoggedIn, (req, res) => {
  res.render("pages/timer");
});

app.get("/404", (req, res) => {
  res.status(404).render("pages/404");
});

app.get("/datenschutz", (req, res) => {
  res.render("pages/datenschutz");
});

app.get("/kontakt", (req, res) => {
  res.render("pages/contact");
});

app.get("/nachricht-versendet", (req, res) => {
  res.render("pages/contactSentConfirmation");
});

app.post("/kontakt", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "mail.infomaniak.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW
    }
  });

  const mailOptions = {
    from: "info@natgian.com",
    to: "info@natgian.com",
    subject: `MyOrganizer - Nachricht von ${name}`,
    text: `Es wurde folgende Nachricht von ${email} über das Kontaktformular gesendet:\n\n ${message}`
  };

  await transporter.sendMail(mailOptions);

  res.redirect("/nachricht-versendet");
});

// ERROR HANDLING
// Error Handler for other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", {err: err});
});

// General Error Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).render("pages/404");
});

// SERVER
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});


