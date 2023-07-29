// Express
const express = require("express");
const router = express.Router();

// Models
const List = require("../models/list");

// Routes

// -- Render LISTEN page
router.get("/", async (req, res) => {
  const lists = await List.find({});
  res.render("pages/listen", { lists });
});

// -- Render Listen SHOW page
router.get("/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const foundList = await List.findById(id);
    if(!foundList) {
      res.status(404).render("pages/404");
    }
    else {
      res.render("lists/show", { foundList});
    }
  }
  catch (err) {
    if(err.name === "CastError") {
      res.status(404).render("pages/404");
    } 
    else {
      res.status(500).render("pages/error");
    }
  }
});

module.exports = router;