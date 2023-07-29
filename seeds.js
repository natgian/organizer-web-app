const mongoose = require("mongoose");
const List = require("./models/list");

// Connecting Mongoose to MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/taskmanagerApp");
  console.log("Connected to MongoDB database");
};

const seedLists = [
  { name: "Einkaufsliste",
    items: ["Äpfel", "Eier", "Brot", "Joghurt"],
    color: "#da7cb4"
  }, 
  { name: "Bücher zum Lesen",
  items: ["Das blaue vom...", "Figaro", "Tralalal", "Weisheiten aus dem All"],
  color: "#d5966c"
  }, 
  { name: "Interessante Künstler",
  items: ["Bingbong Joes", "Mozart", "Haaaa", "The Broos", "The Sistaas", "Nevermind"],
  color: "#a0d058"
  }, 
  { name: "Wandertipps",
  items: ["Bündnerland", "Tessin", "Wallis"],
  color: "#549ecf"
  },
];

List.insertMany(seedLists)
.then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err);
});