const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  country_code: String,
  phone: String,
  dob: Date,
  email: String,
  password: String,
  user_type: String,
  is_deleted: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
