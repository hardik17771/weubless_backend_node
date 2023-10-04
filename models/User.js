const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  country_code: String,
  phone: String,
  dob: Date,
  email: String,
  password: String,
  user_type: Number,
  is_deleted: Number,
});

const User = mongoose.model("User", userSchema);

async function getUser(email, id) {
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findById(id);
    }
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { User, getUser };
