const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const List = require("./models/list");

// Requiring routes
const lists = require("./routes/lists");

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



// ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
})

app.get("/timer", (req, res) => {
  res.render("pages/timer");
})

app.get("/registration", (req, res) => {
  res.render("pages/registration");
})

app.get("/login", (req, res) => {
  res.render("pages/login");
})

// Using required routes
app.use("/listen", lists);


// app.get("/listen", async (req, res) => {
//   const lists = await List.find({});
//   res.render("pages/listen", { lists });
// });

// app.get("/listen/:id", async (req, res) => {
//   const {id} = req.params;
//   try {
//     const foundList = await List.findById(id);
//     if(!foundList) {
//       res.status(404).render("pages/404");
//     }
//     else {
//       res.render("lists/show", { foundList});
//     }
//   }
//   catch (err) {
//     if(err.name === "CastError") {
//       res.status(404).render("pages/404");
//     } 
//     else {
//       res.status(500).render("pages/error");
//     }
//   }
// });

// ERROR HANDLING

// General Error Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).render("pages/404");
});

// Error Handler for other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error");
});



// SERVER
app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});


