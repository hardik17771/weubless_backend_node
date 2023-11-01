const mongoose = require("mongoose");

// Define the schema for Advertisement
const advertisementSchema = new mongoose.Schema({
  id: String, // Assuming id is a string
  category_id: String,
  name: String,
  date_range: String,
  amount: String,
});

// Create the Advertisement model
const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
