const mongoose = require("mongoose");
const validator = require("validator");

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, "Username is required"],
//     unique: [true, "Username should be unique"],
//   },
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     maxlength: [10, "Name is too long"],
//   },
//   country_code: {
//     type: String,
//     required: [true, "Country code is required"],
//     maxlength: [3, "Invalid country code and Max length be 3 only"],
//   },
//   phone: {
//     type: String,
//     required: [true, "Phone is required"],
//     maxlength: [5, "Phone is too long"],
//     unique: [true, "Phone should be unique"],
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     maxlength: [255, "Email is too long"],
//     unique: [true, "Email should be unique"],
//     validate: {
//       validator: function (v) {
//         return validator.isEmail(v);
//       },
//       message: "Invalid email format",
//     },
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
//   user_type: {
//     type: Number,
//     required: [true, "User type is required"],
//   },
//   latitude: {
//     type: String,
//     required: [true, "Latitude is required"],
//   },
//   longitude: {
//     type: String,
//     required: [true, "Longitude is required"],
//   },
//   is_deleted: Number,
// });

// const User = mongoose.model("User", userSchema);

const userSchema2 = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username should be unique"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [255, "Name is too long"],
  },
  country_code: {
    type: String,
    required: [true, "Country code is required"],
    maxlength: [3, "Invalid country code"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    maxlength: [255, "Phone is too long"],
    unique: [true, "Phone should be unique"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    maxlength: [255, "Email is too long"],
    unique: [true, "Email should be unique"],
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  user_type: {
    type: Number,
    required: [true, "User type is required"],
  },
  latitude: {
    type: String,
    required: [true, "Latitude is required"],
  },
  longitude: {
    type: String,
    required: [true, "Longitude is required"],
  },
  is_deleted: Number,
});

const User2 = mongoose.model("User2", userSchema2);

async function getUser(email, id) {
  try {
    let user;
    if (email) {
      user = await User2.findOne({ email });
    } else {
      user = await User2.findById(id);
    }
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { getUser, User2 };
