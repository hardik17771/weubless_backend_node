const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  is_deleted: Boolean,
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
